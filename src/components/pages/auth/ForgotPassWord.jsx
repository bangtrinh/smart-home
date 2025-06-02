import React, { useState, useEffect } from 'react';
import { forgotPassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa'; // icon email
import '../../css/auth/ForgotPassword.css'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setMessage('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
      setError('');
      setTimeout(() => {
        navigate('/confirmResetPassword');
      }, 2000);
    } catch (err) {
      setError('Gửi email khôi phục mật khẩu thất bại: ' + (err.response?.data || err.message));
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
        <h2 className="register-title">Quên mật khẩu</h2>
        <p className="register-subtitle">Nhập email để nhận link đặt lại mật khẩu</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            className="input-field"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">Gửi</button>

        <div className="register-links">
          <a href="/login" className="login-link">Quay lại đăng nhập</a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
