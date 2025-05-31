import React, { useEffect, useState, useContext } from 'react';
import { getYourDeviceControlHistory } from '../../../api/historyApi';
import { getDevicesByContractId } from '../../../api/deviceApi'; // API lấy danh sách thiết bị
import { useContract } from '../../../context/ContractContext';
import '../../css/History.css';

function DeviceControlHistoryPage() {
  const [historyList, setHistoryList] = useState([]);
  const [devicesMap, setDevicesMap] = useState({});
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="history-page">
      <h2 className="history-title">📜 Lịch sử điều khiển thiết bị</h2>

      {loading ? (
        <p className="history-loading">Đang tải dữ liệu...</p>
      ) : historyList.length === 0 ? (
        <p className="history-empty">Chưa có lịch sử điều khiển.</p>
      ) : (
        <div className="history-card">
          <table>
            <thead>
              <tr>
                <th>🕑 Thời gian</th>
                <th>🔌 Thiết bị</th>
                <th>📥 Hành động</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.actionTimestamp).toLocaleString()}</td>
                  <td>{getDeviceName(item.deviceId)}</td>
                  <td>
                    <span
                      className={`history-action ${
                        item.action.includes('*A: 1')
                          ? 'history-action-on'
                          : 'history-action-off'
                      }`}
                    >
                      {item.action.includes('*A: 1') ? 'Bật' : 'Tắt'}
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
