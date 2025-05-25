import { useNavigate } from 'react-router-dom';

function ContractListCard({ contract, onDelete, onViewUsers }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/contracts/${contract.contractId}`);
  };

  return (
    <div className="contract-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="contract-card-header">
        <h3>{contract.contractCode}</h3>
        <span className={`status ${contract.status?.toLowerCase() || 'unknown'}`}>{contract.status}</span>
      </div>

      <div className="contract-card-body">
        <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p><strong>Bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
      </div>

      <div className="contract-card-actions" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onDelete(contract.contractId)}>🗑️</button>
        <button onClick={() => onViewUsers(contract.contractId)}>👥</button>
      </div>
    </div>
  );
}
export default ContractListCard;