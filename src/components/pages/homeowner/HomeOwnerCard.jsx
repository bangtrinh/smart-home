import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../Css/HomeOwner.css';

function HomeOwnerCard({ owner, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/homeowners/edit/${owner.ownerId}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(owner.ownerId);
  };

  const handleHeaderClick = () => {
    navigate(`/homeowners/${owner.ownerId}`);
  };

  return (
    <div className="homeowner-card">
      <div className="homeowner-card-header" onClick={handleHeaderClick} style={{ cursor: 'pointer' }}>
        <h3>{owner.fullName}</h3>
        <span className="status-tag">{t('homeownerCard.owner')}</span>
      </div>

      <div className="homeowner-card-body">
        <div className="info-box"><strong>{t('homeownerCard.email')}:</strong> {owner.email}</div>
        <div className="info-box"><strong>{t('homeownerCard.phone')}:</strong> {owner.phone}</div>
        <div className="info-box"><strong>{t('homeownerCard.address')}:</strong> {owner.address}</div>
      </div>

      <div className="homeowner-card-actions">
        <button className="btn edit-btn" onClick={handleEdit}>{t('homeownerCard.edit')}</button>
        <button className="btn delete-btn" onClick={handleDeleteClick}>{t('homeownerCard.delete')}</button>
      </div>
    </div>
  );
}

export default HomeOwnerCard;
