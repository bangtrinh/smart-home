import React, { useState } from 'react';
import UserDevicesControlList from '../device/UserDevicesControlList';
import '../Css/UserCard.css';
import { useTranslation } from 'react-i18next';

function UserCard({ user, contractId, onDelete, showDeviceButton = true }) {
  const { t } = useTranslation();
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
        <p><strong>{t('userCard.id')}:</strong> {user.id}</p>
        <p><strong>{t('userCard.email')}:</strong> {user.email}</p>
      </div>

      <div className="user-card-actions">
        <button className="btn delete-btn" onClick={() => onDelete(user.id)}>{t('userCard.delete')}</button>
        {showDeviceButton && (
          <button className="btn toggle-btn" onClick={toggleDevices}>
            {showDevices ? t('userCard.hideDevices') : t('userCard.showDevices')}
          </button>
        )}
      </div>

      {showDevices && <UserDevicesControlList userId={user.id} contractId={contractId} />}
    </div>
  );
}

export default UserCard;
