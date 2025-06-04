import React, { useState, useEffect } from 'react';
import { confirmResetPassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { FaKey, FaLock } from 'react-icons/fa'; // icon cho token và password
import { useTranslation } from 'react-i18next';
import '../../css/auth/ForgotPassword.css';

function ConfirmResetPassword() {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'register-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError(t('confirmPasswordMismatch'));
      setMessage('');
      return;
    }

    try {
      await confirmResetPassword({ token, newPassword });
      setMessage(t('passwordResetSuccess'));
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(t('passwordResetFailed') + ': ' + (err.response?.data || err.message));
      setMessage('');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">{t('resetPassword')}</h2>
        <p className="register-subtitle">{t('enterTokenAndNewPassword')}</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="input-group">
          <FaKey className="input-icon" />
          <input
            type="text"
            className="input-field"
            placeholder={t('verificationToken')}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            className="input-field"
            placeholder={t('newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            className="input-field"
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">{t('confirm')}</button>

        <div className="register-links">
          <a href="/login" className="login-link">{t('backToLogin')}</a>
        </div>
      </form>
    </div>
  );
}

export default ConfirmResetPassword;
