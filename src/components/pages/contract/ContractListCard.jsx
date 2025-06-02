import { useNavigate } from 'react-router-dom';
import { unLinkFromContract } from '../../../api/contractApi';

function ContractListCard({ contract, isMyContract, onDelete }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleGoToDetails = () => {
    navigate(`/contracts/${contract.contractId}`);
  };

  const handleGoToEdit = (e) => {
    e.stopPropagation(); // tránh bị trigger vào thẻ cha
    navigate(`/ContractForm?id=${contract.contractId}`);
  };

  const handleUnlink = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn chắc chắn muốn hủy liên kết với hợp đồng ${contract.contractCode}?`)) return;
    try {
      await unLinkFromContract(user.id, contract.contractCode);
      alert('Đã hủy liên kết hợp đồng!');
      if (onDelete) onDelete(contract.contractId);
    } catch (err) {
      alert(err.response?.data || 'Không thể hủy liên kết');
      console.error(err);
    }
  };

  return (
    <div className="contract-card border p-4 rounded-2xl shadow-md bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-blue-600">📄 {contract.contractCode}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          contract.status === 'Active'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {contract.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>👤 <strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p>📅 <strong>Bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p>⏳ <strong>Kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
      </div>

      <div className="flex justify-start gap-2">
        <button
          onClick={handleGoToDetails}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          📘 Xem chi tiết
        </button>

        <button
          onClick={handleGoToEdit}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
        >
          ✏️ Sửa
        </button>
        <button
            onClick={handleUnlink}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            ❌ Xóa
          </button>
        {isMyContract && (
          <button
            onClick={handleUnlink}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            ❌ Hủy liên kết
          </button>
          
        )}
      </div>
    </div>
  );
}

export default ContractListCard;
