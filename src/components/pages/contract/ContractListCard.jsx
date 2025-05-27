import { useNavigate } from 'react-router-dom';
import { unLinkFromContract } from '../../../api/contractApi';

function ContractListCard({ contract, isMyContract, onDelete }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleCardClick = () => {
    navigate(`/contracts/${contract.contractId}`);
  };

  const handleUnlink = async (e) => {
    e.stopPropagation(); // tránh trigger click card
    if (!window.confirm(`Bạn chắc chắn muốn hủy liên kết với hợp đồng ${contract.contractCode}?`)) return;
    try {
      await unLinkFromContract(user.id, contract.contractCode);
      alert('Đã hủy liên kết hợp đồng!');
      if (onDelete) onDelete(contract.contractId); // callback để MyContracts reload
    } catch (err) {
      alert(err.response?.data || 'Không thể hủy liên kết');
      console.error(err);
    }
  };

  return (
    <div
      className="contract-card border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{contract.contractCode}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          contract.status === 'ACTIVE'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-600'
        }`}>
          {contract.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p><strong>Bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
      </div>

      {isMyContract && (
        <div
          className="flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleUnlink}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            ❌ Hủy liên kết
          </button>
        </div>
      )}
    </div>
  );
}

export default ContractListCard;
