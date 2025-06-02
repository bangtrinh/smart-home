import { useNavigate } from 'react-router-dom';
import { unLinkFromContract } from '../../../api/contractApi';

function ContractListCard({ contract, isMyContract, onDelete }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const handleCardClick = () => {
    navigate(`/contracts/${contract.contractId}`);
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
    <div className="contract-card" onClick={handleCardClick}>
      <div className="contract-card-header">
        <h3 className="contract-card-title">{contract.contractCode}</h3>
      </div>

      <div className="contract-card-details">
        <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p><strong>Bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
      </div>

      {isMyContract && (
        <div className="contract-card-footer">
          <button 
            className="delete-button" 
            onClick={handleUnlink}
          >
            Xoá
          </button>
        </div>
      )}
    </div>
  );
}

export default ContractListCard;