import styles from './pages/Css/EditProfile.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api/userService';
import { useTranslation } from 'react-i18next';

function EditProfile() {
  const { t } = useTranslation();  // hook đa ngôn ngữ
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user')) ||
      {};
    setUser(storedUser);
    setFormData({
      username: storedUser.username || '',
      email: storedUser.email || '',
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
      alert(t('editProfile.noUserFound'));
      return;
    }

    try {
      const updated = await updateUserProfile(user.id, formData);
      localStorage.setItem('user', JSON.stringify(updated));
      alert(t('editProfile.updateSuccess'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Update failed:', error);
      alert(t('editProfile.updateFail'));
    }
  };

  const handleCancel = () => {
    const storedUser =
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user'));
    if (storedUser && storedUser.roles.includes('ADMIN')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('editProfile.title')}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>{t('editProfile.username')}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{t('editProfile.email')}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="actionButtons">
          <button type="submit" className="primaryBtn">
            {t('editProfile.save')}
          </button>
          <button
            type="button"
            className="cancelBtn"
            onClick={handleCancel}
          >
            {t('editProfile.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
