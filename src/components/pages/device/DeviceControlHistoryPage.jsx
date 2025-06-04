import React, { useEffect, useState } from 'react';
import { getYourDeviceControlHistory } from '../../../api/historyApi';
import { getDevicesByContractId } from '../../../api/deviceApi';
import { useContract } from '../../../context/ContractContext';
import '../../css/History.css';
import { useTranslation } from 'react-i18next';
import {Search} from 'lucide-react'

function DeviceControlHistoryPage() {
  const { t } = useTranslation();
  const [historyList, setHistoryList] = useState([]);
  const [devicesMap, setDevicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedContractId } = useContract();

  useEffect(() => {
    if (selectedContractId) {
      fetchDevicesAndHistory();
    }
  }, [selectedContractId]);

  const fetchDevicesAndHistory = async () => {
    setLoading(true);
    try {
      const [devices, history] = await Promise.all([
        getDevicesByContractId(selectedContractId),
        getYourDeviceControlHistory(),
      ]);

      const map = {};
      devices.data.forEach(d => {
        map[d.id] = d.deviceName;
      });
      setDevicesMap(map);
      setHistoryList(history);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceName = (id) => devicesMap[id] || `ID: ${id}`;

  // Lọc dữ liệu theo searchTerm
  const filteredHistory = historyList.filter(item => {
    const deviceName = getDeviceName(item.deviceId).toLowerCase();
    const deviceId = String(item.deviceId);
    const actionTime = new Date(item.actionTimestamp).toLocaleString().toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      deviceName.includes(searchLower) ||
      deviceId.includes(searchLower) ||
      actionTime.includes(searchLower)
    );
  });

  return (
    <div className="history-page">
      <div className="page-header">
        <h1 className="page-title">{t('deviceControlHistory.title')}</h1>
      </div>


      <div className="top-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('deviceControlHistory.searchPlaceholder') || "Search by ID or Code"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="history-loading">{t('deviceControlHistory.loading')}</p>
      ) : filteredHistory.length === 0 ? (
        <p className="history-empty">{t('deviceControlHistory.empty')}</p>
      ) : (
        <div className="history-card">
          <table>
            <thead>
              <tr>
                <th>{t('deviceControlHistory.time')}</th>
                <th>{t('deviceControlHistory.device')}</th>
                <th>{t('deviceControlHistory.action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.actionTimestamp).toLocaleString()}</td>
                  <td>{getDeviceName(item.deviceId)}</td>
                  <td>
                    <span
                      className={`history-action ${
                        item.action.includes('*A: 1')
                          ? 'action-on'
                          : 'action-off'
                      }`}
                    >
                      {item.action.includes('*A: 1')
                        ? t('deviceControlHistory.actionOn')
                        : t('deviceControlHistory.actionOff')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DeviceControlHistoryPage;
