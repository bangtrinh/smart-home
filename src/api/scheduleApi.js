import axios from 'axios';

const API_URL = 'http://localhost:8080/api/schedules';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const createSchedule = async (scheduleDTO) => {
  const res = await axios.post(`${API_URL}`, scheduleDTO, { headers: getAuthHeaders() });
  return res.data;
};
