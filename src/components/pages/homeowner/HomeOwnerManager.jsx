import React, { useEffect, useState } from 'react';
import { getHomeOwners, deleteHomeOwner } from '../../../api/homeOwnerApi';
import { Link } from 'react-router-dom';
import HomeOwnerCard from './HomeOwnerCard';
import '../Css/HomeOwner.css';

function HomeOwnerManager() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const data = await getHomeOwners();
    console.log('HomeOwner get by ID:', data);
    setOwners(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa chủ nhà này?')) {
      await deleteHomeOwner(id);
      fetchOwners();
    }
  };

  return (
    <div className="homeowner-manager-container">
      <h2 className="homeowner-title">Danh sách Chủ nhà</h2>
      <Link to="/homeowners/add" className="btn add-btn">+ Thêm chủ nhà</Link>

      <div className="homeowner-card-list">
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
