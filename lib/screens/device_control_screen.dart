import 'package:flutter/material.dart';
import '/services/api_service.dart';
import '/models/user.dart';
import '/screens/login_screen.dart';
import '/screens/user/user_list_screen.dart';
import '/screens/contract/contract_list_screen.dart';
import '/screens/device/device_list.dart';
import '/screens/homeowner/home_owner_list.dart';
import '/screens/device_control_history_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';


class DeviceControlScreen extends StatefulWidget {
  final int userId;
  final int contractId;

  const DeviceControlScreen({super.key, required this.userId, required this.contractId});

  @override
  _DeviceControlScreenState createState() => _DeviceControlScreenState();
}

class _DeviceControlScreenState extends State<DeviceControlScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _devices = [];
  Map<String, bool> _controlStatus = {};
  String? _currentUserId;
  String? _currentUserRole;
  String? _username;
  String? _selectedDeviceId;
  String? _errorMessage;
  bool _isOtpStep = false;
  final _otpController = TextEditingController();
  int _selectedIndex = 0;
  late List<Widget> _widgetOptions;

  @override
  void initState() {
    super.initState();
    _widgetOptions = <Widget>[
      const HomeOwnerList(),
      const DeviceList(),
      const DeviceControlHistoryScreen(),
      const ContractListScreen(),
      const UserListScreen(),
    ];
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      if (token == null || token.isEmpty) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
        return;
      }
      final user = await _apiService.getCurrentUser();
      setState(() {
        _currentUserId = user.id?.toString();
        _currentUserRole = user.roles[0]; // Đã sửa từ roles[0] thành role để khớp với model User
        _username = user.username;
      });
      _fetchDevices();
    } catch (e) {
      print('Error loading user: $e');
      if (e.toString().contains('Token expired or invalid')) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('jwt_token');
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
      setState(() {
        _errorMessage = 'Failed to load user: $e';
      });
    }
  }

  Future<void> _fetchDevices() async {
    try {
      final devices = await _apiService.getDevicesByUser(widget.contractId);
      if (_currentUserId != null) {
        Map<String, bool> controlStatus = {};
        List<Map<String, dynamic>> visibleDevices = [];

        for (var device in devices) {
          final deviceId = device['id'].toString();
          final isActive = await _apiService.isControlActive(widget.userId.toString(), deviceId);
          controlStatus[deviceId] = isActive;

          final isViewingOwnDevice = _currentUserId == widget.userId.toString();

          if (isViewingOwnDevice || isActive) {
            visibleDevices.add(device);
          }
        }

        setState(() {
          _devices = visibleDevices;
          _controlStatus = controlStatus;
          _errorMessage = null;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error fetching devices: $e';
      });
    }
  }

  Future<void> _requestDeviceControl(String deviceId) async {
    if (_currentUserId == null) return;
    try {
      final requestDTO = {
        'userId': _currentUserId,
        'objectId': deviceId,
        'email': '',
        'endDate': DateTime.now().add(const Duration(days: 30)).toIso8601String(),
      };
      final message = await _apiService.requestDeviceControl(requestDTO);
      setState(() {
        _selectedDeviceId = deviceId;
        _isOtpStep = true;
        _errorMessage = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  Future<void> _confirmDeviceControl() async {
    if (_currentUserId == null || _selectedDeviceId == null) return;
    if (_otpController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter OTP';
      });
      return;
    }
    try {
      final confirmDTO = {
        'userId': _currentUserId,
        'objectId': _selectedDeviceId,
        'otpCode': _otpController.text,
        'endDate': DateTime.now().add(const Duration(days: 30)).toIso8601String(),
        'contractCode': 'no',
      };
      final result = await _apiService.confirmDeviceControl(confirmDTO);
      final deviceIdToUpdate = _selectedDeviceId;
      setState(() {
        _isOtpStep = false;
        _selectedDeviceId = null;
        _otpController.clear();
        _errorMessage = null;
        _controlStatus[deviceIdToUpdate!] = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Device control assigned successfully')),
      );
      _fetchDevices();
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  Future<void> _unassignDeviceControl(String deviceId) async {
    if (_currentUserId == null) return;
    try {
      final requestDTO = {
        'userId': widget.userId,
        'objectId': deviceId,
      };
      final message = await _apiService.unassignDeviceControl(requestDTO);
      setState(() {
        _errorMessage = null;
        _controlStatus[deviceId] = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
      _fetchDevices();
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  void _clearForm() {
    setState(() {
      _isOtpStep = false;
      _selectedDeviceId = null;
      _otpController.clear();
      _errorMessage = null;
    });
  }

  void _onItemTapped(int index) {
    if (_currentUserRole == 'ADMIN') {
      setState(() {
        _selectedIndex = index;
      });
    } else if (index > 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Only admins can access management screens')),
      );
    } else {
      setState(() {
        _selectedIndex = index;
      });
    }
  }

  void _logout() async {
    try {
      await _apiService.logout();
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('jwt_token');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Logout failed: $e')),
      );
    }
  }

  void _login() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        if (_errorMessage != null)
                          Text(
                            _errorMessage!,
                            style: const TextStyle(color: Colors.red),
                          ),
                        Expanded(
                          child: _devices.isEmpty
                              ? const Center(
                            child: Text(
                              'Chưa đăng ký thiết bị nào.',
                              style: TextStyle(fontSize: 16, color: Colors.grey),
                            ),
                          )
                              : ListView.builder(
                            itemCount: _devices.length,
                            itemBuilder: (context, index) {
                              final device = _devices[index];
                              final deviceId = device['id'].toString();
                              final isAssigned = _controlStatus[deviceId] ?? false;
                              final isMyDevice = _currentUserId == widget.userId.toString();

                              final canAssign = (_currentUserRole == 'OWNER' && isMyDevice) ||
                                  (_currentUserRole == 'MEMBER' && isMyDevice);

                              final canUnassign = (_currentUserRole == 'OWNER' && !isMyDevice) ||
                                  ((_currentUserRole == 'OWNER' || _currentUserRole == 'MEMBER') &&
                                      isMyDevice);

                              return ListTile(
                                title: Text(device['deviceName'] ?? 'Unnamed Device'),
                                subtitle: Text('ID: ${device['id']} | Status: ${device['status']}'),
                                trailing: _isOtpStep && _selectedDeviceId == deviceId
                                    ? null
                                    : isAssigned
                                    ? (canUnassign
                                    ? ElevatedButton(
                                  onPressed: () => _unassignDeviceControl(deviceId),
                                  child: const Text('Unassign'),
                                )
                                    : null)
                                    : (canAssign
                                    ? ElevatedButton(
                                  onPressed: () => _requestDeviceControl(deviceId),
                                  child: const Text('Assign'),
                                )
                                    : null),
                              );
                            },
                          ),
                        ),
                        if (_isOtpStep)
                          Column(
                            children: [
                              TextFormField(
                                controller: _otpController,
                                decoration: const InputDecoration(labelText: 'OTP Code'),
                              ),
                              const SizedBox(height: 20),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  ElevatedButton(
                                    onPressed: _confirmDeviceControl,
                                    child: const Text('Confirm'),
                                  ),
                                  ElevatedButton(
                                    onPressed: _clearForm,
                                    child: const Text('Cancel'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}