import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Css/Dashboard.module.css';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin người dùng</h2>
      {userInfo ? (
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <label>ID:</label>
            <span>{userInfo.id}</span>
          </div>
          <div className={styles.row}>
            <label>Username:</label>
            <span>{userInfo.username}</span>
          </div>
          <div className={styles.row}>
            <label>Email:</label>
            <span>{userInfo.email}</span>
          </div>
          <div className={styles.row}>
            <label>Roles:</label>
            <span>{userInfo.roles.join(', ')}</span>
          </div>
          <button className={styles.button} onClick={handleEditProfile}>
            Chỉnh sửa thông tin
          </button>
          <button className={styles.button} onClick={handleChangePassword}>
            Đổi mật khẩu
          </button>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
}

export default Dashboard;
