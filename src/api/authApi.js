import api from './api';
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/auth';

// ✅ Sửa: Lưu token vào localStorage ngay sau khi login
export const login = (credentials) =>
  axios.post(`${API_URL}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => {
    const { token } = res.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return res.data;
  });

export const getCurrentUser = () =>
  axios.get(`${API_URL}/current-user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.data);

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Đăng ký thất bại');
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/request`, { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Gửi email khôi phục mật khẩu thất bại');
  }
};

export const confirmResetPassword = async ({ token, newPassword }) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/confirm`, { token, newPassword }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Cập nhật mật khẩu thất bại');
  }
};

// ✅ Sửa: Kiểm tra token trước khi gọi API đổi mật khẩu
export const changePassword = async (changePasswordData) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }

  const response = await axios.put(`${API_URL}/change-password`, changePasswordData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
