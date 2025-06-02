import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Dashboard.css'; 

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
    <div className="profileContainer">

      <h2 className="profileTitle">Thông tin người dùng</h2>

      {userInfo ? (
        <div className="infoSection">
          <div className="infoRow">
            <div className="infoLabel">Username:</div>
            <div className="infoValue">{userInfo.username}</div>
          </div>
          <div className="infoRow">
            <div className="infoLabel">Email:</div>
            <div className="infoValue">{userInfo.email}</div>
          </div>
          <div className="infoRow">
            <div className="infoLabel">Roles:</div>
            <div className="infoValue">{userInfo.roles.join(', ')}</div>
          </div>

          <div className="actionButtons">
            <button className="primaryBtn" onClick={handleEditProfile}>
              Chỉnh sửa thông tin
            </button>
            <button className="primaryBtn" onClick={handleChangePassword}>
              Đổi mật khẩu
            </button>
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
}

export default Dashboard;
