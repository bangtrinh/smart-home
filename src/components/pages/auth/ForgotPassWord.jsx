import React, { useState, useEffect } from 'react';
import { forgotPassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa'; // icon email
import { useTranslation } from 'react-i18next';
import '../../css/auth/ForgotPassword.css';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setMessage(t('forgotPasswordEmailSent'));
      setError('');
      setTimeout(() => {
        navigate('/confirmResetPassword');
      }, 2000);
    } catch (err) {
      setError(t('forgotPasswordEmailFailed') + ': ' + (err.response?.data || err.message));
      setMessage('');
    }
  };

  useEffect(() => {
    document.body.className = 'register-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">{t('forgotPassword')}</h2>
        <p className="register-subtitle">{t('enterEmailForResetLink')}</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            className="input-field"
            type="email"
            placeholder={t('enterYourEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">{t('send')}</button>

        <div className="register-links">
          <a href="/login" className="login-link">{t('backToLogin')}</a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
