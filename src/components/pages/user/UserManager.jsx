import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../../api/userApi';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import '../Css/UserManager.css';
import { useTranslation } from 'react-i18next';

function UserManager() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('userManager.confirmDelete'))) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div className="user-manager-container">
      <h2 className="user-manager-title">{t('userManager.title')}</h2>
      <div className="user-manager-grid">
        {users.map(user => (
          <UserCard 
            key={user.id}
            user={user}
            contractId={null}
            onDelete={handleDelete}
            showDeviceButton={false}
          />
        ))}
      </div>
    </div>
  );
}

export default UserManager;
