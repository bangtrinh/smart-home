import { useNavigate } from 'react-router-dom';
import { unLinkFromContract, deleteContract } from '../../../api/contractApi';
import { useTranslation } from 'react-i18next';

function ContractListCard({ contract, isMyContract, onDelete }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const isAdmin = user?.roles?.includes('ADMIN');

  const handleCardClick = () => {
    navigate(`/contracts/${contract.contractId}`);
  };

  const handleUnlink = async (e) => {
    e.stopPropagation();
    if (!window.confirm(t('contractListCard.confirmUnlink', { contractCode: contract.contractCode }))) return;
    try {
      await unLinkFromContract(user.id, contract.contractId);
      alert(t('contractListCard.unlinkSuccess'));
      if (onDelete) onDelete(contract.contractId);
    } catch (err) {
      alert(err.response?.data || t('contractListCard.unlinkError'));
      console.error(err);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/contracts/edit/${contract.contractId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(t('contractListCard.confirmDelete'))) {
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
          <p><strong>{t('contractListCard.owner')}:</strong> {contract.owner?.fullName}</p>
          <p><strong>{t('contractListCard.start')}:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
          <p><strong>{t('contractListCard.end')}:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
        </div>
      </div>

      {/* Footer buttons tách hẳn, ko dính event */}
      <div className="contract-card-footer">
        {isMyContract && (
          <button className="btn delete-btn" onClick={handleUnlink}>
            {t('contractListCard.unlink')}
          </button>
        )}

        {isAdmin && (
          <>
            <button className="btn edit-btn" onClick={handleEdit}>{t('contractListCard.edit')}</button>
            <button className="btn delete-btn" onClick={handleDelete}>{t('contractListCard.delete')}</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ContractListCard;
