import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContractById } from '../../../api/contractApi';
import UserCard from '../user/UserCard';
import { useNavigate } from 'react-router-dom';
import UserDevicesControlList from '../device/UserDevicesControlList';
import '../../css/ContractDetails.css';
import { ChevronLeft } from 'lucide-react';

function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');


  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    const data = await getContractById(id);
    setContract(data);
  };

  const handleToggleDevices = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null); // nếu đang mở thì tắt
    } else {
      setSelectedUser(user);
    }
  };

  const handleUserClick = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

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


  if (!contract) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="contract-details-container">
      <div className="contract-details-header">
        <h2 className="contract-title">{contract.contractCode}</h2>
        <div className="back-link-container">
          <ChevronLeft size={20} className="back-icon" />
          {user.roles[0] === 'ADMIN' && (
              <Link to="/contracts" className="back-link">
                  Quay lại danh sách hợp đồng
              </Link>
          )}
          {user.roles[0] !== 'ADMIN' && (
              <Link to="/my-contracts" className="back-link">
                  Quay lại danh sách hợp đồng
              </Link>
          )}            
        </div>
      </div>

      <div className="contract-info">
        <p><strong>ID:</strong> {contract.contractId}</p>
        <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p><strong>Ngày bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Ngày kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Số lượng user liên kết:</strong> {contract.users?.length || 0}</p>
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
                <div className="member-role">{u.roles[0]}</div>
              </div>
            ))
          ) : (
            <p className="no-users-message">Không có user nào liên kết.</p>
          )}
        </div>

        {/* Danh sách thiết bị điều khiển của user */}
        {selectedUser && (
          <div className="user-devices-section">
            <h4>Thiết bị của {selectedUser.username}:</h4>
            <UserDevicesControlList userId={selectedUser.id} contractId={contract.contractId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractDetails;
