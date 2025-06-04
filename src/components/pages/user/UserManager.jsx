import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../../api/userApi';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import '../Css/UserManager.css';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react'; // Nếu bạn đang dùng thư viện icon này


function UserManager() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('userManager.confirmDelete'))) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  // Lọc users theo searchTerm
  const filteredUsers = users.filter(user => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true; // nếu không có search thì show all
    return (
      user.id.toString().toLowerCase().includes(term) ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="user-manager-container">
      <h2 className="user-manager-title">{t('userManager.title')}</h2>
<div className="top-bar">
      <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={t('userManager.searchPlaceholder') || 'Search by ID, Username, Email'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      </div>

      <div className="user-manager-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              contractId={null}
              onDelete={handleDelete}
              showDeviceButton={false}
            />
          ))
        ) : (
          <p>{t('userManager.noResults') || 'No users found.'}</p>
        )}
      </div>
    </div>
  );
}

export default UserManager;
