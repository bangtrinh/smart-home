import React, { useEffect, useState } from 'react';
import { addHomeOwner, getHomeOwnerById, updateHomeOwner } from '../../../api/homeOwnerApi';
import { useNavigate, useParams } from 'react-router-dom';

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
    <div>
      <h2>{id ? 'Sửa' : 'Thêm'} chủ nhà</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Họ tên"
          value={owner.fullName}
          onChange={(e) => setOwner({ ...owner, fullName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={owner.email}
          onChange={(e) => setOwner({ ...owner, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={owner.phone}
          onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={owner.address}
          onChange={(e) => setOwner({ ...owner, address: e.target.value })}
        />
        <button type="submit">Lưu</button>
        <button type="button" onClick={() => navigate('/homeowners')}>Hủy</button>
      </form>
    </div>
  );
}

export default HomeOwnerForm;
