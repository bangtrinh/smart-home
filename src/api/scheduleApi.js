import axios from 'axios';

const API_URL = 'http://localhost:8080/api/schedules';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const createSchedule = async (scheduleDTO) => {
  const res = await axios.post(`${API_URL}`, scheduleDTO, { headers: getAuthHeaders() });
  return res.data;
};
