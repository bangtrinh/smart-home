import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../api/authApi';
import '../Css/RegisterForm.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      setError('Đăng ký thất bại: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Chào mừng bạn</h2>
        <p className="register-subtitle">Hãy tạo tài khoản để tiếp tục</p>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Tên đăng nhập"
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
            placeholder="Email"
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
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <button type="submit" className="register-button">Đăng ký</button>

        <div className="register-links">
          <span>Đã có tài khoản?</span>
          <Link to="/login" className="login-link">Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
