import React, { useState } from 'react';
import { changePassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../css/ChangePasswordForm.css';

function ChangePasswordForm() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert(t('newPasswordMismatch'));
      return;
    }

    try {
      const changePasswordData = { oldPassword, newPassword };
      const result = await changePassword(changePasswordData);
      alert(result.message || t('passwordChangeSuccess'));

      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      if (user && user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(t('passwordChangeFailed'));
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <h2 className="change-password-title">{t('changePassword')}</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder={t('oldPassword')}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <input
            type="password"
            placeholder={t('newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <input
            type="password"
            placeholder={t('confirmNewPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <div className="change-password-actions">
            <button type="submit" className="change-password-button">{t('confirm')}</button>
            <button
              type="button"
              className='change-password-cancel'
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                if (user && user.roles.includes('ROLE_ADMIN')) {
                  navigate('/admin/dashboard');
                } else {
                  navigate('/dashboard');
                }
              }}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
