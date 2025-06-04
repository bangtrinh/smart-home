import React, { useEffect, useState } from 'react';
import { getHomeOwners, deleteHomeOwner } from '../../../api/homeOwnerApi';
import { Link } from 'react-router-dom';
import HomeOwnerCard from './HomeOwnerCard';
import '../Css/HomeOwner.css';
import { useTranslation } from 'react-i18next';

function HomeOwnerManager() {
  const { t } = useTranslation();
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
    if (window.confirm(t('homeOwnerManager.confirmDelete'))) {
      await deleteHomeOwner(id);
      fetchOwners();
    }
  };

  return (
    <div className="homeowner-manager-container">
      <h2 className="homeowner-title">{t('homeOwnerManager.title')}</h2>
      <Link to="/homeowners/add" className="btn add-btn">+ {t('homeOwnerManager.add')}</Link>

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
