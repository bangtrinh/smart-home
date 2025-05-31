import api from './api';
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/auth';


export const login = (credentials) =>
  axios.post(`${API_URL}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.data);

export const getCurrentUser = () =>
  axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
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

export const forgotPassword = async ({email}) => {
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


export const changePassword = (changePassword) => {
  return axios.put(`${API_URL}/change-password`, changePassword, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
    }
  }).then(res => res.data);
};
