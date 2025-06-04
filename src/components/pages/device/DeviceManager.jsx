import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDevices, deleteDevice } from '../../../api/deviceApi';
import DeviceCard from './DeviceCard';
import '../../css/MyDevices.css';
import { useTranslation } from 'react-i18next';

function DeviceManager() {
  const [devices, setDevices] = useState([]);
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

  return (
    <div className='my-devices-page'>
      <div className="page-header">
        <h1 className="page-title">{t('deviceManager.pageTitle')}</h1>
      </div>
      <Link className="link-button" to="/devices/add">
        {t('deviceManager.addDeviceButton')}
      </Link>

      <div className="card-list">
        {devices.length > 0 ? (
          devices.map(d => (
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
