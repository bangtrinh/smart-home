import 'dart:convert';
import 'package:http/http.dart' as http;
import '/constants/endpoints.dart';
import '/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final http.Client _client = http.Client();
  static late SharedPreferences _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<LoginResponse> login(String username, String password) async {
    print('Sending login request to ${Endpoints.login}');
    print('Request body: ${jsonEncode({'username': username, 'password': password})}');

    try {
      final response = await _client.post(
        Uri.parse(Endpoints.login),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      print('Response headers: ${response.headers}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final loginResponse = LoginResponse.fromJson(data);
        print('Parsed LoginResponse: token=${loginResponse.token}, user=${loginResponse.user}');
        if (loginResponse.token != null) {
          await _prefs.setString('jwt_token', loginResponse.token!);
          print('Stored token: ${await _prefs.getString('jwt_token')}');
        } else {
          print('No token received from backend');
        }
        return loginResponse;
      } else {
        throw Exception('Failed to login: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Login request failed: $e');
      rethrow;
    }
  }

  Future<User> getCurrentUser() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching current user with token: $token');
    final response = await _client.get(
      Uri.parse(Endpoints.currentUser),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return User.fromJson(data);
    } else if (response.statusCode == 401) {
      await logout();
      throw Exception('Token expired or invalid. Please log in again.');
    } else {
      throw Exception('Failed to load current user: ${response.statusCode}');
    }
  }



  Future<List<Map<String, dynamic>>> getHomeOwners() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching homeowners with token: $token');
    final response = await _client.get(
      Uri.parse(Endpoints.getHomeOwners),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load homeowners: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> getHomeOwnerById(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching homeowner with id: $id, token: $token');
    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/homeowner/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('HomeOwner not found');
    } else {
      throw Exception('Failed to load homeowner: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> addHomeOwner(Map<String, dynamic> homeOwner) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Adding homeowner with token: $token, body: $homeOwner');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/homeowner'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(homeOwner),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 201) {
      throw Exception('Failed to add homeowner: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> updateHomeOwner(int id, Map<String, dynamic> homeOwner) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Updating homeowner with token: $token, id: $id, body: $homeOwner');
    final response = await _client.put(
      Uri.parse('${Endpoints.baseUrl}/homeowner/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(homeOwner),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update homeowner: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> deleteHomeOwner(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Deleting homeowner with token: $token, id: $id');
    final response = await _client.delete(
      Uri.parse('${Endpoints.baseUrl}/homeowner/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 204) {
      throw Exception('Failed to delete homeowner: ${response.statusCode} - ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getDeviceControlHistory() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching device control history with token: $token');
    final response = await _client.get(
      Uri.parse(Endpoints.getDeviceControlHistory),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load device control history: ${response.statusCode}');
    }
  }

  Future<List<Map<String, dynamic>>> getContracts() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching contracts with token: $token');
    final response = await _client.get(
      Uri.parse(Endpoints.getContracts),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else if (response.statusCode == 401) {
      await logout();
      throw Exception('Token expired or invalid. Please log in again.');
    } else {
      throw Exception('Failed to load contracts: ${response.statusCode}');
    }
  }

  Future<List<Map<String, dynamic>>> getUserContracts() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/contract/my-contracts'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load user contracts: ${response.statusCode} - ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getContractUsers(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/contract/$id/users'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load contract users: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> addContract(Map<String, dynamic> contract) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Adding contract with token: $token, body: $contract');
    final response = await _client.post(
      Uri.parse(Endpoints.addContract),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(contract),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 201) {
      throw Exception('Failed to add contract: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> updateContract(int id, Map<String, dynamic> contract) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Updating contract with token: $token, id: $id, body: $contract');
    final response = await _client.put(
      Uri.parse('${Endpoints.updateContract}/$id'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(contract),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update contract: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> deleteContract(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Deleting contract with token: $token, id: $id');
    final response = await _client.delete(
      Uri.parse('${Endpoints.deleteContract}/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 204) {
      throw Exception('Failed to delete contract: ${response.statusCode} - ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getDevices() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching all devices with token: $token');
    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/device'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load devices: ${response.statusCode} - ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getDevicesByUser(int contractId) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching user devices with token: $token');
    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/device/contract/$contractId'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else if (response.statusCode == 404) {
      return [];
    } else {
      throw Exception('Failed to load user devices: ${response.statusCode} - ${response.body}');
    }
  }

  Future<Map<String, dynamic>> getDeviceById(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching device with id: $id, token: $token');
    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/device/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Device not found');
    } else {
      throw Exception('Failed to load device: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> addDevice(Map<String, dynamic> device) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Adding device with token: $token, body: $device');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/device'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(device),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 201) {
      throw Exception('Failed to add device: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> updateDevice(int id, Map<String, dynamic> device) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Updating device with token: $token, id: $id, body: $device');
    final response = await _client.put(
      Uri.parse('${Endpoints.baseUrl}/device/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(device),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update device: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> deleteDevice(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Deleting device with token: $token, id: $id');
    final response = await _client.delete(
      Uri.parse('${Endpoints.baseUrl}/device/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 204) {
      throw Exception('Failed to delete device: ${response.statusCode} - ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getUsers() async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Fetching users with token: $token');
    final response = await _client.get(
      Uri.parse(Endpoints.getUsers),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else if (response.statusCode == 401) {
      await logout();
      throw Exception('Token expired or invalid. Please log in again.');
    } else {
      throw Exception('Failed to load users: ${response.statusCode}');
    }
  }

  Future<void> addUser(Map<String, dynamic> user) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Adding user with token: $token, body: $user');
    final response = await _client.post(
      Uri.parse(Endpoints.addUser),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(user),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 201) {
      throw Exception('Failed to add user: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> updateUser(int id, Map<String, dynamic> user) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Updating user with token: $token, id: $id, body: $user');
    final response = await _client.put(
      Uri.parse('${Endpoints.updateUser}/$id'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(user),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update user: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> deleteUser(int id) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Deleting user with token: $token, id: $id');
    final response = await _client.delete(
      Uri.parse('${Endpoints.deleteUser}/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode != 204) {
      throw Exception('Failed to delete user: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> requestLinkToContract(Map<String, dynamic> requestDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Requesting link to contract with token: $token, body: $requestDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/contract/request-link'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(requestDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to request link: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> confirmLinkToContract(Map<String, dynamic> confirmDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Confirming link to contract with token: $token, body: $confirmDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/contract/confirm-link'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(confirmDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to confirm link: ${response.statusCode} - ${response.body}');
    }
  }

  Future<bool> isControlActive(String userId, String deviceId) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Checking if control is active with token: $token, userId: $userId, deviceId: $deviceId');
    final response = await _client.get(
      Uri.parse('${Endpoints.baseUrl}/device-control/is-active/$userId/$deviceId'),
      headers: {'Authorization': 'Bearer $token'},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as bool;
    } else {
      throw Exception('Failed to check control status: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> requestDeviceControl(Map<String, dynamic> requestDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Requesting device control with token: $token, body: $requestDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/device-control/assign/request'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(requestDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to request device control: ${response.statusCode} - ${response.body}');
    }
  }

  Future<Map<String, dynamic>> confirmDeviceControl(Map<String, dynamic> confirmDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Confirming device control with token: $token, body: $confirmDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/device-control/assign/confirm'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(confirmDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to confirm device control: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> unassignDeviceControl(Map<String, dynamic> requestDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Unassigning device control with token: $token, body: $requestDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/device-control/assign/unassign'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(requestDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to unassign device control: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> publishMessage(Map<String, dynamic> mqttDTO) async {
    final token = _prefs.getString('jwt_token');
    if (token == null) throw Exception('No token found');

    print('Publishing message with token: $token, body: $mqttDTO');
    final response = await _client.post(
      Uri.parse('${Endpoints.baseUrl}/mqtt/publishMessage'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(mqttDTO),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to publish message: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> logout() async {
    try {
      final response = await http.post(
        Uri.parse('${Endpoints.baseUrl}/logout'),
        headers: {'Content-Type': 'application/json'},
      );

      // Xóa token trong Flutter (dù backend đã xóa cookie)
      await _prefs.remove('jwt_token');
    } catch (e) {
      print('Logout error: $e');
    }
  }
}