import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {userInfo ? (
        <div>
          <p><strong>ID:</strong> {userInfo.id}</p>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Roles:</strong> {userInfo.roles.join(', ')}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
}

export default Dashboard;
