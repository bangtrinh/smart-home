import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../../api/contractApi';
import { useNavigate, Link } from 'react-router-dom';
import ContractListCard from './ContractListCard';

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
    if (window.confirm('Xóa hợp đồng này?')) {
      await deleteContract(id);
      fetchContracts();
    }
  };

  const handleViewUsers = (id) => {
    navigate(`/contracts/${id}/users`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📄 Danh sách hợp đồng</h2>
        <Link className="link-button" to="/contracts/add">+ Thêm hợp đồng</Link>
      </div>

      {contracts.map(contract => (
        <ContractListCard
          key={contract.contractId}
          contract={contract}
          onDelete={handleDelete}
          onViewUsers={handleViewUsers}
        />
      ))}
    </div>
  );
}

export default ContractManager;
