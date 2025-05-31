import React, { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { getDevicesByContractId } from '../../../api/deviceApi';
import { checkControlActive } from '../../../api/deviceControlApi';
import { getMyContracts } from '../../../api/contractApi';
import { publishMqttMessage } from '../../../api/mqttApi';
import DeviceCard from './DeviceCard';
import { Select, SelectItem } from '../../ui/Select';
import '../Css/mydevices.css';
import WeatherAndTime from './WeatherAndTime';

function MyDevices() {
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [devices, setDevices] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [controlStatuses, setControlStatuses] = useState({});
  const [deviceStatuses, setDeviceStatuses] = useState({});
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || {};
  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWebSocket(token);

  const handleWebSocketMessage = useCallback((rawMessage, topic) => {
    const parts = topic.split('/');
    const deviceId = parts[parts.length - 1];
    let status = null;
    try {
      const parsed = JSON.parse(rawMessage);
      status = parsed.value;
    } catch (error) {
      console.error('Failed to parse WS message:', error);
      status = rawMessage;
    }

    setDeviceStatuses(prev => ({
      ...prev,
      [deviceId]: status
    }));
  }, []);

  const fetchContracts = useCallback(async () => {
    setLoadingContracts(true);
    try {
      const data = await getMyContracts();
      setContracts(data);
      if (data.length > 0) {
        setSelectedContractId(data[0].contractId); // auto chọn hợp đồng đầu nếu có
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoadingContracts(false);
    }
  }, []);

  const fetchControlStatuses = useCallback(async (devicesList) => {
    const statusMap = {};
    try {
      await Promise.all(
        devicesList.map(async (device) => {
          const isActive = await checkControlActive(user.id, device.id);
          statusMap[device.id] = isActive;
        })
      );
      setControlStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching control statuses:', error);
    }
  }, [user.id]);

  const fetchDevices = useCallback(async (contractId) => {
    if (!contractId) {
      setDevices([]);
      setControlStatuses({});
      return;
    }
    setLoadingDevices(true);
    try {
      const res = await getDevicesByContractId(contractId);
      const deviceList = res.data || [];
      setDevices(deviceList);
      await fetchControlStatuses(deviceList);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
      setControlStatuses({});
    } finally {
      setLoadingDevices(false);
    }
  }, [fetchControlStatuses]);

  const handleContractChange = useCallback((value) => {
    setSelectedContractId(value);
  }, []);

  const handleDeviceClick = useCallback(async (device) => {
    const currentStatus = deviceStatuses[device.id] || '*A: 0';
    const newValue = currentStatus === '*A: 1' ? '*A: 0' : '*A: 1';
    const payload = {
      value: newValue,
      deviceId: device.id,
      contractId: selectedContractId
    };

    try {
      await publishMqttMessage(payload);
      setDeviceStatuses(prev => ({
        ...prev,
        [device.id]: newValue
      }));
    } catch (error) {
      console.error('Failed to send MQTT command:', error);
      alert('Không thể gửi lệnh tới thiết bị.');
    }
  }, [deviceStatuses, selectedContractId]);

  // Khi selectedContractId thay đổi thì fetch devices tương ứng
  useEffect(() => {
    fetchDevices(selectedContractId);
  }, [selectedContractId, fetchDevices]);

  // Lấy hợp đồng khi mount lần đầu
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Manage subscriptions khi devices hoặc connection thay đổi
  useEffect(() => {
    if (!connected || devices.length === 0 || !selectedContractId) return;

    // Huỷ subscriptions cũ
    Object.values(subscriptions).forEach(subId => unsubscribeFromTopic(subId));
    const newSubs = {};

    devices.forEach(device => {
      const topic = `/contract/${selectedContractId}/device/${device.id}`;
      const subId = subscribeToTopic(topic, handleWebSocketMessage);
      if (subId) newSubs[device.id] = subId;
    });

    setSubscriptions(newSubs);

    return () => {
      Object.values(newSubs).forEach(subId => unsubscribeFromTopic(subId));
    };
  }, [connected, devices, selectedContractId, subscribeToTopic, unsubscribeFromTopic, handleWebSocketMessage]);

  // Cleanup khi component unmount hoặc subscriptions thay đổi
  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach(subId => unsubscribeFromTopic(subId));
    };
  }, [subscriptions, unsubscribeFromTopic]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-green-600 text-center">Thiết bị của tôi</h2>
      <div className="mb-8 max-w-md mx-auto">
        <Select
          value={selectedContractId}
          onValueChange={handleContractChange}
          placeholder={loadingContracts ? "Đang tải hợp đồng..." : "Chọn hợp đồng"}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-green-300 focus:border-green-500"
          disabled={loadingContracts}
        >
          {contracts.map(contract => (
            <SelectItem key={contract.contractId} value={contract.contractId}>
              {contract.contractCode}
            </SelectItem>
          ))}
        </Select>
      </div>

      {loadingDevices ? (
        <p className="text-center text-gray-500 italic">Đang tải thiết bị...</p>
        
      ) : devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {devices.map(device => (
            <DeviceCard
              key={device.id}
              device={{ ...device, status: deviceStatuses[device.id] || '*A: 0' }}
              onToggle={handleDeviceClick}
              userId={user.id}
              schedule={true}
            />
          ))}
        </div>
      ) : (
        selectedContractId && (
          <p className="mt-8 text-center text-gray-400 italic">Không có thiết bị nào trong hợp đồng này.</p>
        )
      )}
    </div>
  );
}

export default MyDevices;
