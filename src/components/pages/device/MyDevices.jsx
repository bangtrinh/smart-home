import React, { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { getDevicesByContractId } from '../../../api/deviceApi';
import { checkControlActive } from '../../../api/deviceControlApi';
import { publishMqttMessage } from '../../../api/mqttApi';
import DeviceCard from './DeviceCard';
import { useContract } from '../../../context/ContractContext';
import '../../css/MyDevices.css'
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react'; // Nếu bạn đang dùng thư viện icon này


function MyDevices() {
  const { t } = useTranslation();
  const { selectedContractId } = useContract();
  const [devices, setDevices] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [controlStatuses, setControlStatuses] = useState({});
  const [deviceStatuses, setDeviceStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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
      alert(t('mydevices.publishError'));
    }
  };

  useEffect(() => {
    if (!selectedContractId) {
      console.error("404 Not Found");
      setDevices([]);
      return;
    }

    fetchDevices(selectedContractId);
  }, [selectedContractId]);

  useEffect(() => {
    if (!connected || devices.length === 0 || !selectedContractId) return;

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

  // Filter devices dựa trên searchTerm (theo id hoặc deviceName)
  const filteredDevices = devices.filter(device => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      device.id.toString().toLowerCase().includes(lowerSearch) ||
      (device.deviceName && device.deviceName.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="my-devices-page">
      <div className="page-header">
        <h1 className="page-title">{t('mydevices.pageTitle')}</h1>
        <p className="page-subtitle">{t('mydevices.pageSubtitle')}</p>

              <div className="top-bar">
                <div className="search-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={t('searchPlaceholderDevice') || "Search by ID or Code"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
      </div>

      <div className="devices-container">
        {filteredDevices.length > 0 ? (
          <div className="devices-grid">
            {filteredDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={{
                  ...device,
                  status: deviceStatuses[device.id] || '*A: 0',
                  controllable: controlStatuses[device.id] || false
                }}
                onClick={() => handleDeviceClick(device)}
                userId={user.id}
                schedule={true}
              />
            ))}
          </div>
        ) : (
          selectedContractId && (
            <div className="no-devices-message">
              <p>{t('mydevices.noDevicesMessage')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyDevices;
