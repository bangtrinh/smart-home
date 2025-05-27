import React, { useState } from 'react';
import { changePassword } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

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
      const changePasswordData = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };
      const result = await changePassword(changePasswordData);
      alert(result.message || 'Đổi mật khẩu thành công!');
      navigate('/dashboard');
    } catch (error) {
      alert('Đổi mật khẩu thất bại!');
      console.error('Lỗi:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Xác nhận đổi mật khẩu</button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
