import React, { useEffect, useState } from 'react';
import { addHomeOwner, getHomeOwnerById, updateHomeOwner } from '../../../api/homeOwnerApi';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/HomeOwnerForm.css'

function HomeOwnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (id) fetchOwner();
  }, [id]);

  const fetchOwner = async () => {
    const data = await getHomeOwnerById(id);
    setOwner(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateHomeOwner(id, owner);
    } else {
      await addHomeOwner(owner);
    }
    navigate('/homeowners');
  };

  return (
    <div className="homeowner-form-container">
      <h2>{id ? 'Sửa' : 'Thêm'} Chủ nhà</h2>
      <form onSubmit={handleSubmit} className="homeowner-form">
        <div className="form-group">
          <label>Họ tên</label>
          <input
            type="text"
            placeholder="Nhập họ tên"
            value={owner.fullName}
            onChange={(e) => setOwner({ ...owner, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={owner.email}
            onChange={(e) => setOwner({ ...owner, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={owner.phone}
            onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={owner.address}
            onChange={(e) => setOwner({ ...owner, address: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">💾 Lưu</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/homeowners')}>❌ Hủy</button>
        </div>
      </form>
    </div>
  );
}

export default HomeOwnerForm;
