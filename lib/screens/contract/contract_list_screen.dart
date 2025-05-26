import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'contract_form_screen.dart';

class ContractListScreen extends StatefulWidget {
  const ContractListScreen({super.key});

  @override
  State<ContractListScreen> createState() => _ContractListScreenState();
}

class _ContractListScreenState extends State<ContractListScreen> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _contracts = [];

  @override
  void initState() {
    super.initState();
    _fetchContracts();
  }

  Future<void> _fetchContracts() async {
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

  Future<void> _deleteContract(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text('Are you sure you want to delete this contract?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete')),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _apiService.deleteContract(id);
        _fetchContracts();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete contract: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contracts')),
      body: ListView.builder(
        itemCount: _contracts.length,
        itemBuilder: (context, index) {
          final contract = _contracts[index];
          return ListTile(
            title: Text('${contract['contractCode'] ?? contract['contractNumber']}'),
            subtitle: Text('${contract['startDate']} - ${contract['endDate']}'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ContractFormScreen(contract: contract),
                      ),
                    ).then((_) => _fetchContracts());
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => _deleteContract(contract['contractId']),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ContractFormScreen()),
          );
          _fetchContracts();
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
