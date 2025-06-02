import React, { useState } from 'react';
import { changePassword } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import '../../css/ChangePasswordForm.css';

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const changePasswordData = { oldPassword, newPassword };
      const result = await changePassword(changePasswordData);
      alert(result.message || 'Đổi mật khẩu thành công!');
      navigate('/dashboard');
    } catch (error) {
      alert('Đổi mật khẩu thất bại!');
      console.error('Lỗi:', error);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <h2 className="change-password-title">Đổi mật khẩu</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="change-password-input"
            required
          />
          <div className="change-password-actions">
            <button type="submit" className="change-password-button">Xác nhận</button>
            <button
              type="button"
              className='change-password-cancel'
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
                if (user && user.roles.includes('ADMIN')) {
                  navigate('/admin/dashboard');
                } else {
                  navigate('/dashboard');
                }
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
