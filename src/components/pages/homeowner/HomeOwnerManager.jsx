import React, { useEffect, useState } from 'react';
import { getHomeOwners, deleteHomeOwner } from '../../../api/homeOwnerApi';
import { Link } from 'react-router-dom';
import HomeOwnerCard from './HomeOwnerCard';

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
      <Link to="/homeowners/add" className="link-button">+ Thêm chủ nhà</Link>

      <div className="card-list">
        {owners.map(owner => (
          <HomeOwnerCard
            key={owner.ownerId}
            owner={owner}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeOwnerManager;
