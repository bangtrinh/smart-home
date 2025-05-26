import 'package:flutter/material.dart';
import '/services/api_service.dart';

class HomeOwnerForm extends StatefulWidget {
  final Map<String, dynamic>? homeOwner;

  const HomeOwnerForm({super.key, this.homeOwner});

  @override
  _HomeOwnerFormState createState() => _HomeOwnerFormState();
}

class _HomeOwnerFormState extends State<HomeOwnerForm> {
  final ApiService _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.homeOwner != null) {
      _idController.text = widget.homeOwner!['ownerId'].toString();
      _nameController.text = widget.homeOwner!['fullName'] ?? '';
      _emailController.text = widget.homeOwner!['email'] ?? '';
      _phoneController.text = widget.homeOwner!['phone'] ?? '';
      _addressController.text = widget.homeOwner!['address'] ?? '';
    }
  }


  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    try {
      setState(() => _isLoading = true);
      final homeOwner = {
        'fullName': _nameController.text,
        'email': _emailController.text,
        'phone': _phoneController.text,
        'address': _addressController.text,
      };
      if (_idController.text.isEmpty) {
        await _apiService.addHomeOwner(homeOwner);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('HomeOwner added successfully')),
        );
      } else {
        await _apiService.updateHomeOwner(int.parse(_idController.text), homeOwner);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('HomeOwner updated successfully')),
        );
      }
      Navigator.pop(context); // Quay lại màn hình danh sách
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
    return Scaffold(
      appBar: AppBar(
        title: Text(_idController.text.isEmpty ? 'Add HomeOwner' : 'Edit HomeOwner'),
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
              TextFormField(
                controller: _idController,
                decoration: const InputDecoration(labelText: 'ID'),
                readOnly: true,
                enabled: false,
              ),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter name';
                  return null;
                },
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter email';
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Phone'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter phone';
                  return null;
                },
              ),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(labelText: 'Address'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter address';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                child: Text(_idController.text.isEmpty ? 'Add' : 'Update'),
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
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }
}