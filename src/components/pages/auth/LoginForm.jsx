import '../../css/auth/LoginForm.css';
import React, { useEffect, useState } from 'react';
import { login } from '../../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-form-page');
    return () => document.body.classList.remove('login-form-page');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ username, password });
      if (rememberMe) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('roles', JSON.stringify(result.user.roles));
      } else {
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
        sessionStorage.setItem('roles', JSON.stringify(result.user.roles));
      }
      alert(t('loginSuccess'));
      const roles = result.user.roles;
      if (roles.includes('ADMIN'))
        navigate('/admin/dashboard');
      else
        navigate('/dashboard');

    } catch (error) {
      alert(t('loginFailed'));
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">{t('welcome')}</h2>
        <p className="login-subtitle">{t('pleaseLogin')}</p>

        <div className="login-input-group">
          <FaUser className="login-input-icon" />
          <input
            type="text"
            placeholder={t('username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input-field"
          />
        </div>

        <div className="login-input-group">
          <FaLock className="login-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input-field"
          />
          <span
            className="login-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <div className="login-remember-forgot">
          <label className="login-remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            {t('rememberMe')}
          </label>
          <Link to="/ForgotPassWord" className="login-forgot-link">{t('forgotPassword')}?</Link>
        </div>

        <button type="submit" className="login-button">{t('login')}</button>

        <div className="login-links">
          <span>{t('noAccount')}</span>
          <Link to="/register" className="login-register-link">{t('register')}</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
