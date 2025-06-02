import styles from './pages/Css/EditProfile.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api/userService';

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // lưu user riêng
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');  
    setUser(userData);
    setFormData({
      username: userData.username || '',
      email: userData.email || '',
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Không tìm thấy thông tin người dùng!');
      return;
    }

    try {
      const updated = await updateUserProfile(user.id, formData);
      localStorage.setItem('user', JSON.stringify(updated));
      alert('Cập nhật thông tin thành công!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Cập nhật thất bại!');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Chỉnh sửa thông tin cá nhân</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Lưu thay đổi
        </button>
            
        <button
          type="button"
          className={styles.button}
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
      </form>
    </div>
  );
}

export default EditProfile;
