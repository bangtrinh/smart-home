import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin'; // Với quyền ADMIN
const token = localStorage.getItem('token');

export const updateUserProfile = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
