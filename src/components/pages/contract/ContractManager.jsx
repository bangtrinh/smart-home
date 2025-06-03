import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../../api/contractApi';
import { useNavigate, Link } from 'react-router-dom';
import ContractListCard from './ContractListCard';
import '../../css/Contract.css';

function ContractManager() {
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    const data = await getContracts();
    setContracts(data);
  };

  const handleDelete = async (id) => {
      await deleteContract(id);
      fetchContracts();
    
  };

  return (
    <div className="contract-manager-container">
      <div className="contract-title">
        <h2>Danh sách hợp đồng</h2>
      </div>
      <Link className="link-button" to="/contracts/add">+ Thêm hợp đồng</Link>

      <div className="contracts-grid">
        {contracts.map(contract => (
          <ContractListCard
            key={contract.contractId}
            contract={contract}
            isMyContract={false} 
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ContractManager;