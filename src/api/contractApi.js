import axios from 'axios';

const API_URL = 'http://localhost:8080/api/contract';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getContracts = () => axios.get(API_URL, { headers: getAuthHeaders() }).then(res => res.data);
export const getContractById = (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }).then(res => res.data);
export const addContract = (data) => axios.post(API_URL, data, { headers: getAuthHeaders() });
export const updateContract = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
export const deleteContract = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
export const getUsersByContractId = (contractId) => axios.get(`${API_URL}/${contractId}/users`, { headers: getAuthHeaders() });
