import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeviceById, addDevice, updateDevice } from '../../../api/deviceApi';

function DeviceForm() {
  const { id } = useParams();
  const [device, setDevice] = useState({ name: '', status: 'OFF' });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDevice();
    }
  }, [id]);

  const fetchDevice = async () => {
    const data = await getDeviceById(id);
    setDevice(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateDevice(id, device);
    } else {
      await addDevice(device);
    }
    navigate('/devices');
  };

  return (
    <div>
      <h2>{id ? 'Sửa' : 'Thêm'} thiết bị</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên thiết bị"
          value={device.name}
          onChange={(e) => setDevice({ ...device, name: e.target.value })}
          required
        />
        <select
          value={device.status}
          onChange={(e) => setDevice({ ...device, status: e.target.value })}
        >
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
        <button type="submit">Lưu</button>
        <button type="button" onClick={() => navigate('/devices')}>Hủy</button>
      </form>
    </div>
  );
}

export default DeviceForm;
