import axios from 'axios';

const API_URL = 'http://localhost:8080/api/device';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getDevices = () => axios.get(API_URL, { headers: getAuthHeaders() }).then(res => res.data);
export const getDeviceById = (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }).then(res => res.data);
export const addDevice = (data) => axios.post(API_URL, data, { headers: getAuthHeaders() });
export const updateDevice = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
export const deleteDevice = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
export const getDevicesByContractId = (contractId) =>
  axios.get(`${API_URL}/contract/${contractId}`, { headers: getAuthHeaders() });
