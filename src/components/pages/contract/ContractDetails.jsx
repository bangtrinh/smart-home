import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContractById } from '../../../api/contractApi';
import UserCard from '../user/UserCard';
import { useNavigate } from 'react-router-dom';
import UserDevicesControlList from '../device/UserDevicesControlList';

function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);


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


  if (!contract) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📃 Chi tiết hợp đồng: {contract.contractCode}</h2>
        <Link className="link-button" to="/contracts">← Quay lại</Link>
      </div>

      <div style={{ margin: '20px 0' }}>
        <p><strong>ID:</strong> {contract.contractId}</p>
        <p><strong>Chủ nhà:</strong> {contract.owner?.fullName}</p>
        <p><strong>Ngày bắt đầu:</strong> {contract.startDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Ngày kết thúc:</strong> {contract.endDate?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Trạng thái:</strong> {contract.status}</p>
        <p><strong>Số lượng user liên kết:</strong> {contract.users?.length || 0}</p>
      </div>

      <h3>👥 Danh sách người dùng liên kết:</h3>
        {contract.users?.length > 0 ? (
          contract.users.map(u => (
            <div key={u.id}>
              <UserCard
                user={u}
                contractId={contract.contractId}
                onToggleDevices={() => handleToggleDevices(u)}
                showDeleteButton={false}
                showToggleButton={true}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Không có user nào liên kết.</p>
        )}
    </div>
  );
}

export default ContractDetails;
