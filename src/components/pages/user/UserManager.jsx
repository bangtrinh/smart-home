import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../../api/userApi';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';

function UserManager() {
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
    if (window.confirm('Xoá người dùng này?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>👤 Danh sách người dùng</h2>
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
  );
}

export default UserManager;
