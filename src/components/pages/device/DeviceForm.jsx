import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeviceById, addDevice, updateDevice } from '../../../api/deviceApi';
import { getContracts } from '../../../api/contractApi';
import '../../css/DeviceForm.css'

function DeviceForm() {
  const { id } = useParams();
  const [device, setDevice] = useState({
    deviceName: '',
    status: '*A: 0',  // mặc định luôn là *A: 0
    contractId: ''
  });
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContracts();
    if (id) fetchDevice();
  }, [id]);

  const fetchDevice = async () => {
    const data = await getDeviceById(id);
    setDevice(data);
  };

  const fetchContracts = async () => {
    const data = await getContracts();
    setContracts(data);
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
    <div className="device-form-wrapper">
      <div className="device-form-card">
        <h2>{id ? 'Sửa' : 'Thêm'} thiết bị</h2>
        <form onSubmit={handleSubmit} className="device-form">
          <div className="form-group">
            <label>Tên thiết bị</label>
            <input
              type="text"
              placeholder="Nhập tên thiết bị"
              value={device.deviceName}
              onChange={(e) => setDevice({ ...device, deviceName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Thuộc hợp đồng</label>
            <select
              value={device.contractId}
              onChange={(e) => setDevice({ ...device, contractId: e.target.value })}
              required
            >
              <option value="">-- Chọn hợp đồng --</option>
              {contracts.map(c => (
                <option key={c.contractId} value={c.contractId}>
                  {c.contractCode} - {c.contractName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Lưu
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/devices')}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceForm;