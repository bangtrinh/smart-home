import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import '/services/api_service.dart';
import '/models/user.dart';

class AssignContractScreen extends StatefulWidget {
  const AssignContractScreen({super.key});

  @override
  _AssignContractScreenState createState() => _AssignContractScreenState();
}

class _AssignContractScreenState extends State<AssignContractScreen> {
  final ApiService _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  final _contractCodeController = TextEditingController();
  final _otpController = TextEditingController();
  String? _currentUserId;
  bool _isOtpStep = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final user = await _apiService.getCurrentUser();
      setState(() {
        _currentUserId = user.id?.toString();
      });
    } catch (e) {
      if (e.toString().contains('Token expired or invalid')) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load user: $e')),
        );
      }
    }
  }

  Future<void> _requestLink() async {
    if (_formKey.currentState!.validate()) {
      try {
        final requestDTO = {
          'userId': _currentUserId,
          'objectCode': _contractCodeController.text,
          'endDate': DateTime.now().add(const Duration(days: 30)).toIso8601String(),
        };
        await _apiService.requestLinkToContract(requestDTO);
        if (mounted) {
          setState(() {
            _isOtpStep = true; // Chuyển sang bước nhập OTP
            _errorMessage = null;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('OTP sent to HomeOwner for confirmation')),
          );
        }
      } catch (e) {
        setState(() {
          _errorMessage = 'Error: $e';
        });
      }
    }
  }

  Future<void> _confirmLink() async {
    if (_formKey.currentState!.validate()) {
      try {
        final confirmDTO = {
          'contractCode': _contractCodeController.text,
          'otpCode': _otpController.text,
          'userId': _currentUserId,
          'objectCode': _contractCodeController.text,
          'endDate': DateTime.now().add(const Duration(days: 30)).toIso8601String(),
        };
        await _apiService.confirmLinkToContract(confirmDTO);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('User linked to contract successfully')),
          );
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const HomeScreen()),
                (route) => false, // remove all previous routes
          );
        }
      } catch (e) {
        setState(() {
          _errorMessage = 'Error: $e';
        });
      }
    }
  }

  void _clearForm() {
    setState(() {
      _isOtpStep = false;
      _contractCodeController.clear();
      _otpController.clear();
      _errorMessage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assign to Contract')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (_errorMessage != null)
                Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
              TextFormField(
                controller: _contractCodeController,
                decoration: const InputDecoration(labelText: 'Contract Code'),
                validator: (value) => value == null || value.isEmpty ? 'Enter contract code' : null,
                enabled: !_isOtpStep,
              ),
              if (_isOtpStep)
                TextFormField(
                  controller: _otpController,
                  decoration: const InputDecoration(labelText: 'OTP Code'),
                  validator: (value) => value == null || value.isEmpty ? 'Enter OTP code' : null,
                ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isOtpStep ? _confirmLink : _requestLink,
                child: Text(_isOtpStep ? 'Confirm Link' : 'Request Link'),
              ),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: _clearForm,
                style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                child: const Text('Clear'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
