import 'package:flutter/material.dart';
import '/services/api_service.dart';

class DeviceForm extends StatefulWidget {
  final Map<String, dynamic>? device;

  const DeviceForm({super.key, this.device});

  @override
  _DeviceFormState createState() => _DeviceFormState();
}

class _DeviceFormState extends State<DeviceForm> {
  final ApiService _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  final _nameController = TextEditingController();

  List<Map<String, dynamic>> _contracts = [];
  int? _selectedContractId;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadContracts();

    if (widget.device != null) {
      _idController.text = widget.device!['id'].toString();
      _nameController.text = widget.device!['deviceName'] ?? '';
      _selectedContractId = widget.device!['contractId'];
    }
  }

  Future<void> _loadContracts() async {
    try {
      final contracts = await _apiService.getContracts();
      setState(() {
        _contracts = contracts;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load contracts: $e')),
      );
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedContractId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a contract')),
      );
      return;
    }

    try {
      setState(() => _isLoading = true);

      final device = {
        'deviceName': _nameController.text,
        'contractId': _selectedContractId,
      };

      if (_idController.text.isEmpty) {
        // Trường hợp thêm mới, gán status mặc định
        device['status'] = '*A: 0';
        await _apiService.addDevice(device);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Device added successfully')),
        );
      } else {
        // Trường hợp chỉnh sửa, không gửi status
        await _apiService.updateDevice(int.parse(_idController.text), device);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Device updated successfully')),
        );
      }

      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.device != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Device' : 'Add Device'),
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
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (_idController.text.isNotEmpty)
                TextFormField(
                  controller: _idController,
                  decoration: const InputDecoration(labelText: 'ID'),
                  readOnly: true,
                  enabled: false,
                ),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Device Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter device name';
                  return null;
                },
              ),
              // KHÔNG hiển thị TextFormField cho status nữa

              const SizedBox(height: 16),
              DropdownButtonFormField<int>(
                decoration: const InputDecoration(labelText: 'Contract'),
                value: _selectedContractId,
                items: _contracts.map((contract) {
                  return DropdownMenuItem<int>(
                    value: contract['contractId'],
                    child: Text(contract['contractCode']),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() => _selectedContractId = value);
                },
                validator: (value) {
                  if (value == null) return 'Please select a contract';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                child: Text(isEditing ? 'Update' : 'Add'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _idController.dispose();
    _nameController.dispose();
    super.dispose();
  }
}
