import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/users';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
});

export const getUsers = () => axios.get(API_URL, { headers: getAuthHeaders() }).then(res => res.data);
export const getUserById = (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }).then(res => res.data);
export const addUser = (data) => axios.post(API_URL, data, { headers: getAuthHeaders() });
export const updateUser = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
