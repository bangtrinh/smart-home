import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDevices, deleteDevice } from '../../../api/deviceApi';
import DeviceCard from './DeviceCard';
import '../../css/MyDevices.css'

function DeviceManager() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const deviceList = await getDevices();
      console.log("Device API response:", deviceList); // sẽ thấy mảng thiết bị ở đây
      setDevices(deviceList);
    } catch (err) {
      console.error("Lỗi tải thiết bị:", err);
      setDevices([]);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Xóa thiết bị này?')) {
      await deleteDevice(id);
      fetchDevices();
    }
  };

  return (
    <div className='my-devices-page'>
      <div className="page-header">
        <h1 className="page-title">Quản lý thiết bị</h1>
      </div>
      <Link className="link-button" to="/devices/add">+ Thêm thiết bị</Link>

      <div className="card-list">
        {devices.length > 0 ? (
          devices.map(d => (
            <DeviceCard key={d.id} device={d} onDelete={handleDelete} />
          ))
        ) : (
          <p>Chưa có thiết bị nào.</p>
        )}
      </div>
    </div>
  );
}

export default DeviceManager;
