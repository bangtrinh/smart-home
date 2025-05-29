import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHomeOwnerById } from '../../../api/homeOwnerApi';
import { getContractsByOwnerId } from '../../../api/contractApi';
import ContractCard from '../contract/ContractListCard';

function HomeOwnerDetails() {
  const { ownerId  } = useParams();
  const [owner, setOwner] = useState(null);
  const [contracts, setContracts] = useState([]);

    useEffect(() => {
    if (ownerId) {
        fetchOwnerDetails();
        fetchContracts();
    }
    }, [ownerId]);

    const fetchOwnerDetails = async () => {
    const data = await getHomeOwnerById(ownerId);
    console.log('Owner details:', data);
    setOwner(data);
    };


  const fetchContracts = async () => {
    const data = await getContractsByOwnerId(ownerId);
    console.log('Contracts for owner:', data);
    setContracts(data);
  };

  if (!owner) return <p>Đang tải...</p>;

  return (
    <div>
      <h2>Chi tiết Chủ nhà</h2>
      <div className="contract-card">
        <h3>{owner.fullName}</h3>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>SĐT:</strong> {owner.phone}</p>
        <p><strong>Địa chỉ:</strong> {owner.address}</p>
      </div>

      <h3>Hợp đồng của chủ nhà này</h3>
      {contracts.length > 0 ? (
        contracts.map(contract => (
          <ContractCard key={contract.contractId} contract={contract} />
        ))
      ) : (
        <p>Chưa có hợp đồng nào.</p>
      )}
      <Link to="/homeowners">⬅️ Quay lại danh sách chủ nhà</Link>
    </div>
  );
}

export default HomeOwnerDetails;
