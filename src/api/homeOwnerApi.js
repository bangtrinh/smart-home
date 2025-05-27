import axios from 'axios';

const API_URL = 'http://localhost:8080/api/homeowner';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getHomeOwners = () => axios.get(API_URL, { headers: getAuthHeaders() }).then(res => res.data);
export const getHomeOwnerById = (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }).then(res => res.data);
export const addHomeOwner = (data) => axios.post(API_URL, data, { headers: getAuthHeaders() });
export const updateHomeOwner = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
export const deleteHomeOwner = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
