import React, { useEffect, useState } from 'react';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../../api/contractApi';
import ContractCard from './ContractListCard';
import { useTranslation } from 'react-i18next';
import '../../css/Contract.css';
import {Search} from 'lucide-react'

function MyContracts() {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contractCode, setContractCode] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await getMyContracts();
      setContracts(data);
    } catch (error) {
      console.error(t('errorFetchingContracts'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLink = async () => {
    if (!contractCode) {
      alert(t('pleaseEnterContractCode'));
      return;
    }
    try {
      await requestLinkToContract({
        objectCode: contractCode,
        userId: user.id
      });
      alert(t('otpSentToOwner'));
      setShowOtpInput(true);
    } catch (err) {
      alert(err.response?.data || t('errorSendingLinkRequest'));
      console.error(err);
    }
  };

  const handleConfirmLink = async () => {
    if (!otp) {
      alert(t('pleaseEnterOtp'));
      return;
    }
    try {
      await confirmLinkToContract({
        contractCode: contractCode,
        otpCode: otp,
        userId: user.id
      });
      alert(t('linkSuccess'));
      setContractCode('');
      setOtp('');
      setShowOtpInput(false);
      fetchContracts();
    } catch (err) {
      alert(err.response?.data || t('linkConfirmFailed'));
      console.error(err);
    }
  };

  // Filter contracts theo searchTerm (theo contractCode hoặc contractName)
  const filteredContracts = contracts.filter(contract => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (contract.contractCode && contract.contractCode.toLowerCase().includes(lowerSearch)) ||
      (contract.contractName && contract.contractName.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="contract-manager-container">
      <div className="contract-title">
        <h2>{t('myContracts')}</h2>
      </div>


      <div className="top-bar">
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

      

      {loading ? (
        <p className="loading-text">{t('loadingMyContracts')}</p>
      ) : filteredContracts.length > 0 ? (
        <div className="contract-grid">
          {filteredContracts.map(contract => (
            <ContractCard
              key={contract.contractId}
              contract={contract}
              isMyContract={true}
              onDelete={fetchContracts}
            />
          ))}
        </div>
      ) : (
        <p className="empty-text">{t('noContractsYet')}</p>
      )}
    </div>
  );
}

export default MyContracts;
