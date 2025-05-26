import 'package:flutter/material.dart';
import '/services/api_service.dart';
import '/screens/device/device_form.dart';

class DeviceList extends StatefulWidget {
  const DeviceList({super.key});

  @override
  _DeviceListState createState() => _DeviceListState();
}

class _DeviceListState extends State<DeviceList> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _devices = [];
  String? _errorMessage;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchDevices();
  }

  Future<void> _fetchDevices() async {
    if (_isLoading) return;
    setState(() => _isLoading = true);
    try {
      final devices = await _apiService.getDevices();
      setState(() {
        _devices = devices;
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

  Future<void> _deleteDevice(int id) async {
    try {
      await _apiService.deleteDevice(id);
      _fetchDevices();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Device deleted successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  void _navigateToForm([Map<String, dynamic>? device]) async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DeviceForm(device: device)),
    );
    _fetchDevices(); // Reload dữ liệu khi quay lại
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Device List')),
      body: Column(
        children: [
          if (_errorMessage != null)
            Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red),
            ),
          Expanded(
            child: _devices.isEmpty
                ? const Center(child: Text('No devices available'))
                : ListView.builder(
              itemCount: _devices.length,
              itemBuilder: (context, index) {
                final device = _devices[index];
                return ListTile(
                  title: Text(device['deviceName'] ?? 'Unnamed'),
                  subtitle: Text('ID: ${device['id'] ?? 'N/A'} | Status: ${device['status'] ?? 'N/A'}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _navigateToForm(device),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _deleteDevice(device['id']),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToForm(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
