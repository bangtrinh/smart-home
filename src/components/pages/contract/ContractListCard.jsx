import { useNavigate } from 'react-router-dom';
import { unLinkFromContract, deleteContract } from '../../../api/contractApi';

function ContractListCard({ contract, isMyContract, onDelete }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const isAdmin = user?.roles?.includes('ADMIN');

  const handleCardClick = () => {
    navigate(`/contracts/${contract.contractId}`);
  };

  const handleUnlink = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn chắc chắn muốn hủy liên kết với hợp đồng ${contract.contractCode}?`)) return;
    try {
      await unLinkFromContract(user.id, contract.contractId);
      alert('Đã hủy liên kết hợp đồng!');
      if (onDelete) onDelete(contract.contractId);
    } catch (err) {
      alert(err.response?.data || 'Không thể hủy liên kết');
      console.error(err);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/contracts/edit/${contract.contractId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Xóa hợp đồng này?')) {
      if (onDelete) {
        onDelete(contract.contractId);
      }
    }
  };

  return (
    <div className="contract-card">
      {/* Chỉ phần header click mới vào detail */}
      <div className="contract-card-body" onClick={handleCardClick}>
        <div className="contract-card-header">
          <h3 className="contract-card-title">{contract.contractCode}</h3>
        </div>

        <div className="contract-card-details">
          <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
          <p><strong>Bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
          <p><strong>Kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
        </div>
      </div>

      {/* Footer buttons tách hẳn, ko dính event */}
      <div className="contract-card-footer">
        {isMyContract && (
          <button className="btn delete-btn" onClick={handleUnlink}>
            Hủy liên kết
          </button>
        )}

        {isAdmin && (
          <>
            <button className="btn edit-btn" onClick={handleEdit}>Sửa</button>
            <button className="btn delete-btn" onClick={handleDelete}>Xóa</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ContractListCard;
