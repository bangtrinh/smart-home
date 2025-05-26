import 'package:flutter/material.dart';
import 'package:frontendv2/services/api_service.dart';

class DeviceControlHistoryScreen extends StatefulWidget {
  const DeviceControlHistoryScreen({super.key});

  @override
  _DeviceControlHistoryScreenState createState() => _DeviceControlHistoryScreenState();
}

class _DeviceControlHistoryScreenState extends State<DeviceControlHistoryScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _history = [];

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final history = await _apiService.getDeviceControlHistory();
      setState(() {
        _history = history;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load history: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: _history.length,
      itemBuilder: (context, index) {
        final item = _history[index];
        return ListTile(
          title: Text('Action: ${item['action']}'),
          subtitle: Text('Time: ${item['actionTimestamp']}'),
          trailing: Text('Device ID: ${item['deviceId']}'),
        );
      },
    );
  }
}