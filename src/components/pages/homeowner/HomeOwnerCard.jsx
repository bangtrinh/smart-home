import React from 'react';
import { Link } from 'react-router-dom';

function HomeOwnerCard({ owner, onDelete }) {
  return (
    <Link to={`/homeowners/${owner.ownerId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="contract-card">
        <div className="contract-card-header">
          <h3>{owner.fullName}</h3>
          <span className="status">Chủ nhà</span>
        </div>

        <div className="contract-card-body">
          <p><strong>ID:</strong> {owner.ownerId}</p>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>SĐT:</strong> {owner.phone}</p>
          <p><strong>Địa chỉ:</strong> {owner.address}</p>
        </div>

        <div className="contract-card-actions">
          <button onClick={(e) => { e.preventDefault(); onDelete(owner.ownerId); }}>🗑️ Xoá</button>
        </div>
      </div>
    </Link>
  );
}

export default HomeOwnerCard;
