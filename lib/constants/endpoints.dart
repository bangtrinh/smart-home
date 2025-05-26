class Endpoints {
  static const String baseUrl = 'http://localhost:8080/api';

  // Auth Endpoints
  static const String login = '$baseUrl/auth/login';
  static const String logout = '$baseUrl/auth/logout';
  static const String resetPasswordRequest = '$baseUrl/auth/reset-password/request';
  static const String resetPasswordConfirm = '$baseUrl/auth/reset-password/confirm';
  static const String currentUser = '$baseUrl/auth/me';

  // HomeOwner Endpoints
  static const String getHomeOwners = '$baseUrl/homeowner';

  // Device Control History Endpoints
  static const String getDeviceControlHistory = '$baseUrl/device-control-history';

  // Device Endpoints (nếu cần mở rộng)
  static const String getDevices = '$baseUrl/device';

  // Contract Endpoints (nếu cần mở rộng)
  static const String getContracts = '$baseUrl/contract';

  static const String addContract = '$baseUrl/contract';
  static const String updateContract = '$baseUrl/contract';
  static const String deleteContract = '$baseUrl/contract';
  static const String getUsers = '$baseUrl/admin/users';
  static const String addUser = '$baseUrl/admin/users';
  static const String updateUser = '$baseUrl/admin/users';
  static const String deleteUser = '$baseUrl/admin/users';
}