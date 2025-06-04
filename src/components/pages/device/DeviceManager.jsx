import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDevices, deleteDevice } from '../../../api/deviceApi';
import DeviceCard from './DeviceCard';
import '../../css/MyDevices.css';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react'; // Nếu bạn đang dùng thư viện icon này

function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const deviceList = await getDevices();
      setDevices(deviceList);
    } catch (err) {
      console.error("Lỗi tải thiết bị:", err);
      setDevices([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deviceManager.deleteConfirm'))) {
      await deleteDevice(id);
      fetchDevices();
    }
  };

  // Lọc thiết bị theo searchTerm (so sánh id hoặc deviceCode)
  const filteredDevices = devices.filter(device => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      device.id.toString().includes(lowerSearch) ||
      (device.deviceName && device.deviceName.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className='my-devices-page'>
      <div className="page-header">
        <h1 className="page-title">{t('deviceManager.pageTitle')}</h1>
      </div>

      <div className="top-bar">
        <Link className="link-button" to="/devices/add">
          {t('deviceManager.addDeviceButton')}
        </Link>

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

      <div className="card-list">
        {filteredDevices.length > 0 ? (
          filteredDevices.map(d => (
            <DeviceCard key={d.id} device={d} onDelete={handleDelete} />
          ))
        ) : (
          <p>{t('deviceManager.noDevicesMessage')}</p>
        )}
      </div>
    </div>
  );
}

export default DeviceManager;
