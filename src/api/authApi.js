import api from './api';

export const login = (credentials) =>
  axios.post(`${API_URL}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.data);

export const register = (userData) =>
  axios.post(`${API_URL}/register`, userData, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.data);

export const getCurrentUser = () =>
  axios.get(`${API_URL}/current-user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.data);
