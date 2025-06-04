import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Dashboard.css'; 
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
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

      <h2 className="profileTitle">{t('admindashboard.userInfoTitle')}</h2>

      {userInfo ? (
        <div className="infoSection">
          <div className="infoRow">
            <div className="infoLabel">{t('admindashboard.username')}:</div>
            <div className="infoValue">{userInfo.username}</div>
          </div>
          <div className="infoRow">
            <div className="infoLabel">Email:</div>
            <div className="infoValue">{userInfo.email}</div>
          </div>
          <div className="infoRow">
            <div className="infoLabel">{t('admindashboard.roles')}:</div>
            <div className="infoValue">{userInfo.roles.join(', ')}</div>
          </div>

          <div className="actionButtons">
            <button className="primaryBtn" onClick={handleEditProfile}>
              {t('admindashboard.editProfile')}
            </button>
            <button className="primaryBtn" onClick={handleChangePassword}>
              {t('admindashboard.changePassword')}
            </button>
          </div>
        </div>
      ) : (
        <p> {t('admindashboard.loading')}</p>
      )}
    </div>
  );
}

export default Dashboard;
