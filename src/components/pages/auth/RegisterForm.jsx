import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../api/authApi';
import '../../css/auth/RegisterForm.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function RegisterForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      alert(t('registerSuccess'));
      navigate('/login');
    } catch (error) {
      setError(t('registerFailed') + ': ' + (error.response?.data || error.message));
    }
  };

  useEffect(() => {
    document.body.className = 'register-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">{t('welcome')}</h2>
          <p className="register-subtitle">{t('createAccount')}</p>

          {error && <p className="error">{error}</p>}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="register-button">{t('register')}</button>

          <div className="register-links">
            <span>{t('alreadyAccount')}</span>
            <Link to="/login" className="login-link">{t('login')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
