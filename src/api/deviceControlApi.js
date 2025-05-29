import axios from 'axios';

const API_URL = 'http://localhost:8080/api/device-control';
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
});
// Gửi yêu cầu cấp quyền điều khiển (Gửi OTP)
export const assignControlRequest = (data) => {
  return axios.post(`${API_URL}/assign/request`, data, { headers: getAuthHeaders() });
};

// Xác nhận quyền điều khiển (nhập OTP, endDate)
export const assignControlConfirm = (data) => {
  return axios.post(`${API_URL}/assign/confirm`, data, { headers: getAuthHeaders() });
};

// Hủy quyền điều khiển thiết bị
export const unassignControl = (data) => {
  return axios.post(`${API_URL}/assign/unassign`, data, { headers: getAuthHeaders() });
};

// Kiểm tra trạng thái điều khiển của user với thiết bị
export const checkControlActive = (userId, deviceId) => {
  return axios.get(`${API_URL}/is-active/${userId}/${deviceId}`, { headers: getAuthHeaders() });
};
