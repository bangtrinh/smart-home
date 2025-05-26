import 'package:flutter/material.dart';
import '/services/api_service.dart';

class UserFormScreen extends StatefulWidget {
  final Map<String, dynamic>? user;

  const UserFormScreen({super.key, this.user});

  @override
  _UserFormScreenState createState() => _UserFormScreenState();
}

class _UserFormScreenState extends State<UserFormScreen> {
  final ApiService _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _rolesController = TextEditingController();
  bool get _isEditing => widget.user != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      _usernameController.text = widget.user!['username'];
      _emailController.text = widget.user!['email'];
      _rolesController.text = (widget.user!['roles'] as List).join(',');
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _rolesController.dispose();
    super.dispose();
  }

  Future<void> _saveUser() async {
    if (_formKey.currentState!.validate()) {
      try {
        final userData = {
          'username': _usernameController.text,
          'email': _emailController.text,
          'roles': _rolesController.text.split(',').map((e) => e.trim()).toList(),
        };
        if (_isEditing) {
          await _apiService.updateUser(widget.user!['id'], userData);
        } else {
          await _apiService.addUser(userData);
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(_isEditing ? 'User updated' : 'User added')),
          );
          Navigator.pop(context, true); // Trả về true để báo màn list reload
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save user: $e')),
        );
      }
    }
  }

  void _cancel() {
    Navigator.pop(context, false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit User' : 'Add User'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _usernameController,
                decoration: const InputDecoration(labelText: 'Username'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter username';
                  return null;
                },
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter email';
                  return null;
                },
              ),
              TextFormField(
                controller: _rolesController,
                decoration: const InputDecoration(labelText: 'Roles (comma-separated, e.g., ADMIN,USER)'),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter roles';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: _saveUser,
                    child: Text(_isEditing ? 'Update User' : 'Add User'),
                  ),
                  const SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: _cancel,
                    child: const Text('Cancel'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
