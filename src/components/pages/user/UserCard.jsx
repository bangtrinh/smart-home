import React from 'react';

function UserCard({ user, onDelete }) {
  return (
    <div className="contract-card">
      <div className="contract-card-header">
        <h3>{user.username}</h3>
        <span className="status">{user.roles.join(', ')}</span>
      </div>

      <div className="contract-card-body">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Trạng thái:</strong> {user.enabled ? 'Hoạt động' : 'Khoá'}</p>
      </div>

      <div className="contract-card-actions">
        {/* Có thể thêm nút Sửa nếu muốn */}
        <button onClick={() => onDelete(user.id)}>🗑️ Xoá</button>
      </div>
    </div>
  );
}

export default UserCard;
