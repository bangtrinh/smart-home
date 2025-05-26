import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Format ngày tháng
import '../../services/api_service.dart';

class ContractFormScreen extends StatefulWidget {
  final Map<String, dynamic>? contract;

  const ContractFormScreen({super.key, this.contract});

  @override
  State<ContractFormScreen> createState() => _ContractFormScreenState();
}

class _ContractFormScreenState extends State<ContractFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _contractNumberController = TextEditingController();
  final _startDateController = TextEditingController();
  final _endDateController = TextEditingController();
  final ApiService _apiService = ApiService();

  List<Map<String, dynamic>> _homeOwners = [];
  int? _selectedOwnerId;
  bool _isLoading = false;

  final _inputDateFormat = DateFormat('dd/MM/yyyy');
  final _outputDateFormat = DateFormat('yyyy-MM-dd');

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    setState(() => _isLoading = true);

    try {
      final homeOwners = await _apiService.getHomeOwners();
      setState(() => _homeOwners = homeOwners);

      if (widget.contract != null) {
        _contractNumberController.text = widget.contract!['contractCode'] ?? '';

        // Convert yyyy-MM-dd from backend -> dd/MM/yyyy for UI
        if (widget.contract!['startDate'] != null) {
          final start = DateTime.tryParse(widget.contract!['startDate']);
          if (start != null) {
            _startDateController.text = _inputDateFormat.format(start);
          }
        }

        if (widget.contract!['endDate'] != null) {
          final end = DateTime.tryParse(widget.contract!['endDate']);
          if (end != null) {
            _endDateController.text = _inputDateFormat.format(end);
          }
        }

        _selectedOwnerId = widget.contract!['ownerId'];
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load data: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _saveContract() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedOwnerId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a HomeOwner')),
      );
      return;
    }

    try {
      // Parse input from dd/MM/yyyy -> yyyy-MM-dd
      final parsedStartDate = _inputDateFormat.parseStrict(_startDateController.text);
      final parsedEndDate = _inputDateFormat.parseStrict(_endDateController.text);

// Format thành LocalDateTime chuỗi ISO-8601
      final startDateString = parsedStartDate.toIso8601String().split('.').first;
      final endDateString = parsedEndDate.toIso8601String().split('.').first;

      final contractData = {
        'contractCode': _contractNumberController.text,
        'startDate': startDateString, // "yyyy-MM-ddTHH:mm:ss"
        'endDate': endDateString,
        'ownerId': _selectedOwnerId,
      };


      setState(() => _isLoading = true);

      if (widget.contract != null) {
        await _apiService.updateContract(widget.contract!['contractId'], contractData);
      } else {
        await _apiService.addContract(contractData);
      }

      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Invalid date format. Use dd/MM/yyyy')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _contractNumberController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.contract != null;

    return Scaffold(
      appBar: AppBar(title: Text(isEditing ? 'Edit Contract' : 'Add Contract')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _contractNumberController,
                decoration: const InputDecoration(labelText: 'Contract Code'),
                validator: (value) =>
                value == null || value.isEmpty ? 'Required' : null,
              ),
              TextFormField(
                controller: _startDateController,
                decoration: const InputDecoration(
                    labelText: 'Start Date (dd/MM/yyyy)'),
                keyboardType: TextInputType.datetime,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Required';
                  try {
                    _inputDateFormat.parseStrict(value);
                    return null;
                  } catch (_) {
                    return 'Invalid format';
                  }
                },
              ),
              TextFormField(
                controller: _endDateController,
                decoration:
                const InputDecoration(labelText: 'End Date (dd/MM/yyyy)'),
                keyboardType: TextInputType.datetime,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Required';
                  try {
                    _inputDateFormat.parseStrict(value);
                    return null;
                  } catch (_) {
                    return 'Invalid format';
                  }
                },
              ),
              DropdownButtonFormField<int>(
                value: _selectedOwnerId,
                items: _homeOwners
                    .map((owner) => DropdownMenuItem<int>(
                  value: owner['ownerId'],
                  child: Text(owner['fullName'] ?? 'Unnamed'),
                ))
                    .toList(),
                onChanged: (value) =>
                    setState(() => _selectedOwnerId = value),
                decoration: const InputDecoration(labelText: 'Select HomeOwner'),
                validator: (value) =>
                value == null ? 'Please select a HomeOwner' : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveContract,
                child: Text(isEditing ? 'Update' : 'Create'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
