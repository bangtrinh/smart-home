import React, { useEffect, useState } from 'react';
import { getHomeOwners, deleteHomeOwner } from '../../../api/homeOwnerApi';
import { Link } from 'react-router-dom';
import HomeOwnerCard from './HomeOwnerCard';
import '../Css/HomeOwner.css';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react'; // Nếu bạn đang dùng thư viện icon này


function HomeOwnerManager() {
  const { t } = useTranslation();
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const data = await getHomeOwners();
      setOwners(data);
    } catch (error) {
      console.error("Failed to fetch homeowners:", error);
      setOwners([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('homeOwnerManager.confirmDelete'))) {
      await deleteHomeOwner(id);
      fetchOwners();
    }
  };

  // Lọc danh sách owners theo searchTerm
  const filteredOwners = owners.filter(owner => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true; // nếu không search thì show hết
    return (
      owner.ownerId.toString().toLowerCase().includes(term) ||
      (owner.fullName && owner.fullName.toLowerCase().includes(term)) ||
      (owner.phone && owner.phone.toLowerCase().includes(term)) ||
      (owner.email && owner.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="homeowner-manager-container">
      <h2 className="homeowner-title">{t('homeOwnerManager.title')}</h2>

<div className="top-bar">
        <Link to="/homeowners/add" className="btn add-btn">+ {t('homeOwnerManager.add')}</Link>
        <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={t('homeOwnerManager.searchPlaceholder') || 'Search by ID, Name, Phone, Email'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        </div>

      <div className="homeowner-card-list">
        {filteredOwners.length > 0 ? (
          filteredOwners.map(owner => (
            <HomeOwnerCard
              key={owner.ownerId}
              owner={owner}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>{t('homeOwnerManager.noResults') || 'No owners found.'}</p>
        )}
      </div>
    </div>
  );
}

export default HomeOwnerManager;
