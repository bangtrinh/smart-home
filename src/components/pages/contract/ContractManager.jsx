import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../../api/contractApi';
import { useNavigate, Link } from 'react-router-dom';
import ContractListCard from './ContractListCard';
import '../../css/Contract.css';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

function ContractManager() {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter contracts dựa trên searchTerm (theo contractId hoặc contractCode)
  const filteredContracts = contracts.filter(contract => {
    const term = searchTerm.toLowerCase();
    return (
      contract.contractId.toString().toLowerCase().includes(term) ||
      (contract.contractCode && contract.contractCode.toLowerCase().includes(term))
    );
  });

  return (
    <div className="contract-manager-container">
      <div className="contract-title">
        <h2>{t('contractListTitle')}</h2>
      </div>

      <div className="top-bar">
        <Link className="link-button" to="/contracts/add">+ {t('addContract')}</Link>

        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('searchPlaceholder') || "Search by ID or Code"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      <div className="contracts-grid">
        {filteredContracts.length > 0 ? (
          filteredContracts.map(contract => (
            <ContractListCard
              key={contract.contractId}
              contract={contract}
              isMyContract={false}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>{t('noContractFound') || "No contracts found."}</p>
        )}
      </div>
    </div>
  );
}

export default ContractManager;
