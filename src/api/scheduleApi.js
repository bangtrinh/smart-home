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

export const getSchedulesByDevice = async (id) => {
  const res = await axios.get(`${API_URL}/device/${id}`, { headers: getAuthHeaders() })
  return res.data;
}

export const cancelSchedule = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
}
