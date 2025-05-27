import React, { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { getDevicesByContractId } from '../../../api/deviceApi';
import { checkControlActive } from '../../../api/deviceControlApi';
import { getMyContracts } from '../../../api/contractApi';
import { publishMqttMessage } from '../../../api/mqttApi';
import DeviceCard from './DeviceCard';
import { Select, SelectItem } from '../../ui/Select';

function MyDevices() {
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [devices, setDevices] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [controlStatuses, setControlStatuses] = useState({});
  const [deviceStatuses, setDeviceStatuses] = useState({});

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWebSocket(token);

  const handleWebSocketMessage = useCallback((rawMessage, topic) => {
    const parts = topic.split('/');
    const deviceId = parts[parts.length - 1];
    let status = null;
    try {
      const parsed = JSON.parse(rawMessage);
      status = parsed.value; // lấy trường value từ object JSON
    } catch (error) {
      console.error('Failed to parse WS message:', error);
      status = rawMessage; // fallback nếu không parse được
    }

    console.log('Received WS message:', { deviceId, status });

    setDeviceStatuses(prev => ({
      ...prev,
      [deviceId]: status
    }));
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await getMyContracts();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchControlStatuses = async (devices) => {
    const statusMap = {};
    await Promise.all(
      devices.map(async (device) => {
        const isActive = await checkControlActive(user.id, device.id);
        statusMap[device.id] = isActive;
      })
    );
    setControlStatuses(statusMap);
  };

  const fetchDevices = async (contractId) => {
    if (!contractId) return;

    try {
      const res = await getDevicesByContractId(contractId);
      setDevices(res.data);
      await fetchControlStatuses(res.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleContractChange = (value) => {
    setSelectedContractId(value);
    fetchDevices(value);
  };

  const handleDeviceClick = async (device) => {
    const currentStatus = deviceStatuses[device.id] || '*A: 0';
    const payload = {
      value: currentStatus === '*A: 1' ? '*A: 0' : '*A: 1',
      deviceId: device.id,
      contractId: selectedContractId
    };

    try {
      await publishMqttMessage(payload);
      setDeviceStatuses(prev => ({
        ...prev,
        [device.id]: payload.value
      }));
    } catch (error) {
      console.error('Failed to send MQTT command:', error);
      alert('Không thể gửi lệnh tới thiết bị.');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (!connected || devices.length === 0 || !selectedContractId) return;

    // Unsubscribe old
    Object.values(subscriptions).forEach(subId => unsubscribeFromTopic(subId));
    setSubscriptions({});

    const newSubs = {};
    devices.forEach(device => {
      const topic = `/contract/${selectedContractId}/device/${device.id}`;
      const subId = subscribeToTopic(topic, handleWebSocketMessage);
      if (subId) {
        newSubs[device.id] = subId;
      }
    });

    setSubscriptions(newSubs);

    return () => {
      Object.values(newSubs).forEach(subId => unsubscribeFromTopic(subId));
    };
  }, [connected, devices, selectedContractId, subscribeToTopic, unsubscribeFromTopic, handleWebSocketMessage]);

  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach(subId => unsubscribeFromTopic(subId));
    };
  }, [subscriptions, unsubscribeFromTopic]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Thiết bị của tôi</h2>

      <div className="mb-6">
        <Select
          value={selectedContractId}
          onValueChange={handleContractChange}
          placeholder="Chọn hợp đồng"
        >
          {contracts.map(contract => (
            <SelectItem key={contract.contractId} value={contract.contractId}>
              {contract.contractCode}
            </SelectItem>
          ))}
        </Select>
      </div>

      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map(device => (
            <DeviceCard
              key={device.id}
              device={{ ...device, status: deviceStatuses[device.id] || '*A: 0' }}
              onClick={() => handleDeviceClick(device)}
              userId={user.id}
              schedule={true}
            />
          ))}
        </div>
      ) : (
        selectedContractId && (
          <p className="mt-4 text-gray-500">Không có thiết bị nào trong hợp đồng này.</p>
        )
      )}
    </div>
  );
}

export default MyDevices;
