import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/HomeOwner.css';

function HomeOwnerCard({ owner, onDelete }) {
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
        <span className="status-tag">Chủ nhà</span>
      </div>

      <div className="homeowner-card-body">
        <div className="info-box"><strong>Email:</strong> {owner.email}</div>
        <div className="info-box"><strong>SĐT:</strong> {owner.phone}</div>
        <div className="info-box"><strong>Địa chỉ:</strong> {owner.address}</div>
      </div>

      <div className="homeowner-card-actions">
        <button className="btn edit-btn" onClick={handleEdit}>Sửa</button>
        <button className="btn delete-btn" onClick={handleDeleteClick}>Xoá</button>
      </div>
    </div>
  );
}


export default HomeOwnerCard;
