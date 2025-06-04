import React, { useEffect, useState } from 'react';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../../api/contractApi';
import ContractCard from './ContractListCard';
import { useTranslation } from 'react-i18next';
import '../../css/Contract.css'

function MyContracts() {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contractCode, setContractCode] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
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
      fetchContracts(); // reload hợp đồng mới
    } catch (err) {
      alert(err.response?.data || t('linkConfirmFailed'));
      console.error(err);
    }
  };

  return (
    <div className="contract-manager-container">
      <div className="contract-title">
        <h2>{t('myContracts')}</h2>
      </div>
      {loading ? (
        <p className="loading-text">{t('loadingMyContracts')}</p>
      ) : contracts.length > 0 ? (
        <div className="contract-grid">
          {contracts.map(contract => (
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
