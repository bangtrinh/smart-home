import React, { useEffect, useState } from 'react';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../../api/contractApi';
import ContractCard from './ContractListCard';
import { Link } from 'react-router-dom';
import '../../css/Contract.css'

function MyContracts() {
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
      console.error('Lỗi khi lấy hợp đồng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLink = async () => {
    if (!contractCode) {
      alert('Vui lòng nhập mã hợp đồng');
      return;
    }
    try {
      await requestLinkToContract({
        objectCode: contractCode,
        userId: user.id
      });
      alert('OTP đã được gửi đến chủ nhà để xác nhận!');
      setShowOtpInput(true);
    } catch (err) {
      alert(err.response?.data || 'Lỗi khi gửi yêu cầu liên kết');
      console.error(err);
    }
  };

  const handleConfirmLink = async () => {
    if (!otp) {
      alert('Vui lòng nhập OTP');
      return;
    }
    try {
      await confirmLinkToContract({
        contractCode: contractCode,
        otpCode: otp,
        userId: user.id
      });
      alert('Liên kết hợp đồng thành công!');
      setContractCode('');
      setOtp('');
      setShowOtpInput(false);
      fetchContracts(); // reload hợp đồng mới
    } catch (err) {
      alert(err.response?.data || 'Xác nhận liên kết thất bại');
      console.error(err);
    }
  };

  return (
    <div className="contract-manager-container">
      <div className="contract-title">
        <h2>Hợp đồng của tôi</h2>
      </div>
      {loading ? (
        <p className="loading-text">Đang tải hợp đồng của bạn...</p>
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
        <p className="empty-text">Bạn chưa có hợp đồng nào.</p>
      )}
    </div>
  );
}

export default MyContracts;
