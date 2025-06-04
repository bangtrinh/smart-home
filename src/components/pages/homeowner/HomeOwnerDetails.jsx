import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHomeOwnerById } from '../../../api/homeOwnerApi';
import { getContractsByOwnerId } from '../../../api/contractApi';
import ContractCard from '../contract/ContractListCard';
import '../../css/HomeOwnerDetails.css'
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function HomeOwnerDetails() {
  const { t } = useTranslation();
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

  if (!owner) return <p>{t('homeOwnerDetails.loading')}</p>;

  return (
    <div className="homeowner-details-wrapper">
      <div className="homeowner-card">
        <h2>{t('homeOwnerDetails.title')}</h2>
        <div className="homeowner-info">
          <h3>{owner.fullName}</h3>
          <p><strong>{t('homeOwnerDetails.email')}:</strong> {owner.email}</p>
          <p><strong>{t('homeOwnerDetails.phone')}:</strong> {owner.phone}</p>
          <p><strong>{t('homeOwnerDetails.address')}:</strong> {owner.address}</p>
        </div>
      </div>

      <div className="contracts-section">
        <h3>{t('homeOwnerDetails.contractsTitle')}</h3>
        {contracts.length > 0 ? (
          <div className="contracts-grid">
            {contracts.map(contract => (
              <ContractCard key={contract.contractId} contract={contract} />
            ))}
          </div>
        ) : (
          <p>{t('homeOwnerDetails.noContracts')}</p>
        )}
      </div>

      <div className="back-link">
        <ChevronLeft size={20}/>
        <Link to="/homeowners">
          {t('homeOwnerDetails.backToList')}
        </Link>
      </div>
    </div>
  );
}

export default HomeOwnerDetails;
