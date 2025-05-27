import axios from "axios";

const API_BASE = "http://localhost:8080/api/mqtt";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const publishMqttMessage = (mqtt) => {
  return axios.post(
    `${API_BASE}/publishMessage`,
    mqtt,
    { headers: getAuthHeaders() }
  );
};
