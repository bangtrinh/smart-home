import React, { useEffect, useState } from 'react';
import { getHomeOwners, deleteHomeOwner } from '../../../api/homeOwnerApi';
import { Link } from 'react-router-dom';

function HomeOwnerManager() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const data = await getHomeOwners();
    setOwners(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa chủ nhà này?')) {
      await deleteHomeOwner(id);
      fetchOwners();
    }
  };

  return (
    <div>
      <h2>Danh sách Chủ nhà</h2>
      <Link to="/homeowners/add">+ Thêm chủ nhà</Link>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {owners.map(owner => (
            <tr key={owner.ownerId}>
              <td>{owner.ownerId}</td>
              <td>{owner.fullName}</td>
              <td>{owner.email}</td>
              <td>
                <Link to={`/homeowners/edit/${owner.ownerId}`}>Sửa</Link>
                <button onClick={() => handleDelete(owner.ownerId)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeOwnerManager;
