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

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User ID:', user.id);
  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWebSocket(token);

  const handleWebSocketMessage = useCallback((payload) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === payload.deviceId
          ? { ...device, status: payload.status }
          : device
      )
    );
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
        console.log(`Device ${device.id} active status:`, isActive);
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

      Object.values(subscriptions).forEach(subId => unsubscribeFromTopic(subId));
      setSubscriptions({});

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
    const payload = {
      value: device.status === '*A: 1' ? '*A: 0' : '*A: 1',
      deviceId: device.id,
      contractId: selectedContractId
    };

    try {
      await publishMqttMessage(payload);
      setDevices(prevDevices =>
        prevDevices.map(d =>
          d.id === device.id
            ? { ...d, status: payload.value }
            : d
        )
      );
    } catch (error) {
      console.error('Failed to send MQTT command:', error);
      alert('Không thể gửi lệnh tới thiết bị.');
    }
  };

  const handleSubscribe = (device) => {
    const topic = `/contract/${selectedContractId}/device/${device.id}`;
    const subId = subscribeToTopic(topic, handleWebSocketMessage);
    if (subId) {
      setSubscriptions(prev => ({ ...prev, [topic]: subId }));
    }
  };

  const handleUnsubscribe = (device) => {
    const topic = `/contract/${selectedContractId}/device/${device.id}`;
    const subId = subscriptions[topic];
    if (subId) {
      unsubscribeFromTopic(subId);
      setSubscriptions(prev => {
        const newSubs = { ...prev };
        delete newSubs[topic];
        return newSubs;
      });
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

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
          {devices.map(device => {
            const topic = `/contract/${selectedContractId}/device/${device.id}`;
            const isSubscribed = controlStatuses[device.id];

            return (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={() => handleDeviceClick(device)}
                isSubscribed={isSubscribed}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                userId={user.id} // nếu cần kiểm tra quyền bằng token hoặc userId thực tế
            />
            );
          })}
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