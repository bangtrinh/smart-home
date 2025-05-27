import React, { useState } from 'react';
import { confirmResetPassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { FaKey, FaLock } from 'react-icons/fa'; // icon cho token và password
import '../Css/ForgotPassword.css';
function ConfirmResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmResetPassword({ token, newPassword });
      setMessage('Mật khẩu đã được cập nhật thành công. Bạn có thể đăng nhập lại.');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Cập nhật mật khẩu thất bại: ' + (err.response?.data || err.message));
      setMessage('');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Đặt lại mật khẩu</h2>
        <p className="register-subtitle">Nhập token xác thực và mật khẩu mới</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="input-group">
          <FaKey className="input-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Token xác thực"
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
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">Xác nhận</button>

        <div className="register-links">
          <span>Quay lại </span>
          <a href="/login" className="login-link">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
}

export default ConfirmResetPassword;
