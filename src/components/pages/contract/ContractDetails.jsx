import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContractById } from '../../../api/contractApi';
import UserDevicesControlList from '../device/UserDevicesControlList';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';  // <-- import
import '../../css/ContractDetails.css';

function ContractDetails() {
  const { t } = useTranslation();  // <-- hook i18n

  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const backLink = user.roles?.[0] === 'ADMIN' ? '/contracts' : '/my-contracts';

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      try {
        const data = await getContractById(id);
        setContract(data);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  const handleUserClick = useCallback((user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  }, [selectedUser]);

  const getAvatarColor = (role) => {
    switch (role) {
      case 'owner':
        return '#fb923c'; // orange
      case 'member':
        return '#facc15'; // yellow
      default:
        return '#a3a3a3'; // gray
    }
  };

  if (loading) return <div>{t('loadingData')}</div>;

  if (!contract) return <div>{t('noContractFound')}</div>;

  return (
    <div className="contract-details-container">
      <div className="contract-details-header">
        <h2 className="contract-title">{contract.contractCode}</h2>
        <div className="back-link-container">
          <ChevronLeft size={20} className="back-icon" />
          <Link to={backLink} className="back-link">
            {t('backToContractList')}
          </Link>
        </div>
      </div>

      <div className="contract-info">
        <p><strong>{t('id')}:</strong> {contract.contractId}</p>
        <p><strong>{t('homeOwner')}:</strong> {contract.owner?.fullName}</p>
        <p><strong>{t('startDate')}:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>{t('endDate')}:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>{t('linkedUsersCount')}:</strong> {contract.users?.length || 0}</p>
      </div>

      <div className="users-section">
        <div className="members-list">
          {contract.users?.length > 0 ? (
            contract.users.map(u => (
              <div key={u.id} className="member-item" onClick={() => handleUserClick(u)}>
                <div
                  className="member-avatar"
                  style={{ backgroundColor: getAvatarColor(u.roles[0]) }}
                >
                  {u.username[0]?.toUpperCase()}
                </div>
                <div className="member-name">{u.username}</div>
                <div className="member-role">{t(u.roles[0])}</div> {/* assuming role keys exist */}
              </div>
            ))
          ) : (
            <p className="no-users-message">{t('noLinkedUsers')}</p>
          )}
        </div>

        {selectedUser && (
          <div className="user-devices-section">
            <h4>{t('devicesOfUser', { username: selectedUser.username })}:</h4>
            <UserDevicesControlList userId={selectedUser.id} contractId={contract.contractId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractDetails;
