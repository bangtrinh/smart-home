import React, { useState } from 'react';
import UserDevicesControlList from '../device/UserDevicesControlList';

function UserCard({ user, contractId, onDelete, showDeviceButton = true }) {
  const [showDevices, setShowDevices] = useState(false);

  const toggleDevices = () => {
    setShowDevices(!showDevices);
  };

  return (
    <div className="contract-card">
      <div className="contract-card-header">
        <h3>{user.username}</h3>
      </div>

      <div className="contract-card-body">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="contract-card-actions">
        <button onClick={() => onDelete(user.id)}>🗑️ Xoá</button>
        {showDeviceButton && (
          <button onClick={toggleDevices}>
            {showDevices ? 'Ẩn thiết bị' : 'Xem thiết bị'}
          </button>
        )}
      </div>

      {showDevices && <UserDevicesControlList userId={user.id} contractId={contractId} />}
    </div>
  );
}

export default UserCard;
