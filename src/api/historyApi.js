import axios from 'axios';

const API_URL = 'http://localhost:8080/api/device-control-history';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getYourDeviceControlHistory = async () => {
  const res = await axios.get(`${API_URL}/your-history`, { headers: getAuthHeaders() });
  return res.data
};