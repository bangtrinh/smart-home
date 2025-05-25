import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDevices, deleteDevice } from '../../../api/deviceApi';

function DeviceManager() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const data = await getDevices();
    setDevices(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa thiết bị này?')) {
      await deleteDevice(id);
      fetchDevices();
    }
  };

  return (
    <div>
      <h2>Thiết bị</h2>
      <Link to="/devices/add">+ Thêm thiết bị</Link>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thiết bị</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.deviceName}</td>
              <td>{d.status}</td>
              <td>
                <Link to={`/devices/edit/${d.id}`}>Sửa</Link>
                <button onClick={() => handleDelete(d.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceManager;
