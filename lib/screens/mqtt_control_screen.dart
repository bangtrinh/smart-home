import 'package:flutter/material.dart';
import 'login_screen.dart';
import '/services/api_service.dart';
import '/models/user.dart';

class MqttControlScreen extends StatefulWidget {
  const MqttControlScreen({super.key});

  @override
  _MqttControlScreenState createState() => _MqttControlScreenState();
}

class _MqttControlScreenState extends State<MqttControlScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _devices = [];
  late List<Map<String, dynamic>> _contracts = [];
  Map<String, bool> _switchValues = {};
  String? _currentUserId;
  String? _errorMessage;
  bool _isLoading = false;
  int? _selectedContractId;

  @override
  void initState() {
    super.initState();
    _loadCurrentUser().then((_) {
      if (_currentUserId != null) {
        _fetchContracts().then((_) {
          if (_contracts.isNotEmpty) {
            _selectedContractId = _contracts.first['contractId'];
            _fetchDevices();
          }
        });
      }
    });
  }

  Future<void> _loadCurrentUser() async {
    try {
      final user = await _apiService.getCurrentUser();
      setState(() {
        _currentUserId = user.id?.toString();
      });
    } catch (e) {
      print('Error loading user: $e');
      if (e.toString().contains('Token expired or invalid')) {
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

  Future<void> _fetchContracts() async {
    if (_isLoading || _currentUserId == null) return;
    setState(() => _isLoading = true);
    try {
      final contracts = await _apiService.getUserContracts();
      setState(() {
        _contracts = contracts;
        _errorMessage = null;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error fetching contracts: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchDevices() async {
    if (_isLoading || _selectedContractId == null) return;
    setState(() => _isLoading = true);
    try {
      final devices = await _apiService.getDevicesByUser(_selectedContractId!);
      Map<String, bool> initialValues = {};
      for (var device in devices) {
        final deviceId = device['id'].toString();
        final isActive = device['status'] == '*A: 1';
        initialValues[deviceId] = isActive;
      }
      setState(() {
        _devices = devices;
        _switchValues = initialValues;
        _errorMessage = null;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error fetching devices: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _publishMessage(String deviceId, bool value) async {
    if (_isLoading || _currentUserId == null || _selectedContractId == null) return;
    setState(() => _isLoading = true);
    try {
      final mqttDTO = {
        'deviceId': int.parse(deviceId),
        'contractId': _selectedContractId,
        'value': value ? '*A: 1' : '*A: 0',
      };
      await _apiService.publishMessage(mqttDTO);

      final device = _devices.firstWhere(
            (d) => d['id'].toString() == deviceId,
        orElse: () => {'deviceName': 'Unnamed Device'},
      );
      final deviceName = device['deviceName'] ?? 'Unnamed Device';
      final message = value ? 'Đã bật $deviceName' : 'Đã tắt $deviceName';

      setState(() {
        _switchValues[deviceId] = value;
        _errorMessage = null;
      });

      ScaffoldMessenger.of(context).hideCurrentSnackBar();
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
    } finally {
      setState(() => _isLoading = false);
    }
  }

  IconData _getIconFromDeviceName(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('light')) return Icons.lightbulb;
    if (lower.contains('fan')) return Icons.toys;
    if (lower.contains('tv')) return Icons.tv;
    if (lower.contains('air') || lower.contains('ac')) return Icons.ac_unit;
    return Icons.devices; // Mặc định
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MQTT Control'),
        actions: [
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(color: Colors.white),
            ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Dropdown chọn contract
            if (_contracts.isNotEmpty)
              DropdownButtonFormField<int>(
                value: _selectedContractId,
                decoration: const InputDecoration(
                  labelText: 'Contract',
                  border: OutlineInputBorder(),
                ),
                items: _contracts.map((contract) {
                  return DropdownMenuItem<int>(
                    value: contract['contractId'],
                    child: Text(
                      contract['contractCode'] ?? 'Contract ${contract['contractId']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                  );
                }).toList(),
                onChanged: (int? newValue) {
                  if (newValue != null && newValue != _selectedContractId) {
                    setState(() {
                      _selectedContractId = newValue;
                      _fetchDevices();
                    });
                  }
                },
              ),
            const SizedBox(height: 16),

            if (_errorMessage != null)
              Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 16),

            Expanded(
              child: _devices.isEmpty
                  ? const Center(child: Text('No devices available'))
                  : ListView.builder(
                itemCount: _devices.length,
                itemBuilder: (context, index) {
                  final device = _devices[index];
                  final deviceId = device['id'].toString();
                  final deviceName = device['deviceName'] ?? 'Unnamed Device';
                  final isActive = _switchValues[deviceId] ?? false;

                  return GestureDetector(
                    onTap: () {
                      _publishMessage(deviceId, !isActive);
                    },
                    child: Card(
                      elevation: 4,
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      child: ListTile(
                        leading: Icon(
                          _getIconFromDeviceName(deviceName),
                          color: isActive ? Colors.orange : Colors.grey,
                          size: 30,
                        ),
                        title: Text(deviceName),
                        subtitle: Text('ID: $deviceId'),
                        trailing: Text(
                          isActive ? 'Bật' : 'Tắt',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: isActive ? Colors.green : Colors.red,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}