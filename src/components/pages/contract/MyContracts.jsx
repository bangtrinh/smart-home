import React, { useEffect, useState } from 'react';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../../api/contractApi';
import ContractCard from './ContractListCard';
import { Link } from 'react-router-dom';

function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contractCode, setContractCode] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || {};

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📑 Hợp đồng của tôi</h2>

      {loading ? (
        <p className="text-gray-600">Đang tải hợp đồng của bạn...</p>
      ) : contracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <p className="text-gray-500">Bạn chưa có hợp đồng nào.</p>
      )}

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">🔗 Liên kết hợp đồng mới</h3>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Nhập mã hợp đồng"
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
          <button
            onClick={handleRequestLink}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📩 Gửi yêu cầu
          </button>
        </div>

        {showOtpInput && (
          <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            />
            <button
              onClick={handleConfirmLink}
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ✅ Xác nhận
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/dashboard"
          className="text-blue-500 hover:underline inline-flex items-center"
        >
          ⬅️ Quay lại Dashboard
        </Link>
      </div>
    </div>
  );
}

export default MyContracts;
