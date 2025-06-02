import React from 'react';
import { Link } from 'react-router-dom';
import '../Css/HomeOwner.css';

function HomeOwnerCard({ owner, onDelete }) {
  return (
    <div className="homeowner-card">
      <div className="homeowner-card-header">
        <h3>{owner.fullName}</h3>
        <span className="status-tag">Chủ nhà</span>
      </div>

      <div className="homeowner-card-body">
        <div className="info-box">
          <strong>Email:</strong> {owner.email}
        </div>
        <div className="info-box">
          <strong>SĐT:</strong> {owner.phone}
        </div>
        <div className="info-box">
          <strong>Địa chỉ:</strong> {owner.address}
        </div>
      </div>

      <div className="homeowner-card-actions"> 
        {/* Truyènr own id để thực hiện việc sửa  */}
        <Link to={`/homeowners/edit/${owner.ownerId}`} className="btn edit-btn">
          ✏️ Sửa
        </Link>
        <button
          className="btn delete-btn"
          onClick={() => onDelete(owner.ownerId)}
        >
          🗑️ Xoá
        </button>
      </div>
    </div>
  );
}

export default HomeOwnerCard;
