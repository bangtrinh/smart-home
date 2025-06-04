import React, { useEffect, useState } from 'react';
import { addHomeOwner, getHomeOwnerById, updateHomeOwner } from '../../../api/homeOwnerApi';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/HomeOwnerForm.css';
import { useTranslation } from 'react-i18next';

function HomeOwnerForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (id) fetchOwner();
  }, [id]);

  const fetchOwner = async () => {
    const data = await getHomeOwnerById(id);
    setOwner(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateHomeOwner(id, owner);
    } else {
      await addHomeOwner(owner);
    }
    navigate('/homeowners');
  };

  return (
    <div className="homeowner-form-container">
      <h2>{id ? t('homeOwnerForm.editTitle') : t('homeOwnerForm.addTitle')}</h2>
      <form className="homeowner-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('homeOwnerForm.fullName')}</label>
          <input
            type="text"
            value={owner.fullName}
            onChange={(e) => setOwner({ ...owner, fullName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('homeOwnerForm.email')}</label>
          <input
            type="email"
            value={owner.email}
            onChange={(e) => setOwner({ ...owner, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('homeOwnerForm.phone')}</label>
          <input
            type="text"
            value={owner.phone}
            onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{t('homeOwnerForm.address')}</label>
          <input
            type="text"
            value={owner.address}
            onChange={(e) => setOwner({ ...owner, address: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">{t('homeOwnerForm.save')}</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/homeowners')}>{t('homeOwnerForm.cancel')}</button>
        </div>
      </form>
    </div>
  );
}

export default HomeOwnerForm;
