import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../../api/userApi';
import UserCard from './UserCard';

function UserManager() {
  const [users, setUsers] = useState([]);

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
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default UserManager;
