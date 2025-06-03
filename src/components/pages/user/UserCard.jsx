import React, { useState } from 'react';
import UserDevicesControlList from '../device/UserDevicesControlList';
import '../Css/UserCard.css';
function UserCard({ user, contractId, onDelete, showDeviceButton = true }) {
  const [showDevices, setShowDevices] = useState(false);

  const toggleDevices = () => {
    setShowDevices(!showDevices);
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3>{user.username}</h3>
      </div>

      <div className="user-card-body">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    {/* thêm class để css  */}
      <div className="user-card-actions">
        <button className="btn delete-btn" onClick={() => onDelete(user.id)}>Xoá</button>
        {showDeviceButton && (
          <button className="btn toggle-btn" onClick={toggleDevices}>
            {showDevices ? 'Ẩn thiết bị' : 'Xem thiết bị'}
          </button>
        )}
      </div>

      {showDevices && <UserDevicesControlList userId={user.id} contractId={contractId} />}
    </div>
  );
}

export default UserCard;
