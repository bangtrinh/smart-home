import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);


  const handleChangePassword = () => {
    navigate('/change-password');
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
          <button onClick={handleChangePassword}>Đổi mật khẩu</button>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
}

export default Dashboard;
