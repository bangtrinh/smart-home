import React, { useEffect, useState } from 'react';
import { addContract, getContractById, updateContract } from '../../../api/contractApi';
import { getHomeOwners } from '../../../api/homeOwnerApi';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/ContractForm.css'

function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    contractCode: '',
    ownerId: '',
    startDate: '',
    endDate: '',
    status: 'Pending'
  });
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
    if (id) fetchContract();
  }, [id]);

  const fetchOwners = async () => {
    const data = await getHomeOwners();
    setOwners(data);
  };

  const fetchContract = async () => {
    const data = await getContractById(id);
    setContract({
      contractCode: data.contractCode,
      ownerId: data.ownerId,
      startDate: data.startDate ? data.startDate.slice(0, 16) : '',
      endDate: data.endDate ? data.endDate.slice(0, 16) : '',
      status: data.status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      contractCode: contract.contractCode,
      ownerId: contract.ownerId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status
    };

    console.log('Contract DTO gửi về server:', payload);

    if (id) {
      await updateContract(id, payload);
    } else {
      await addContract(payload);
    }
    navigate('/contracts');
  };

  return (
    <div className="contract-form-container">
      <h2>{id ? 'Sửa' : 'Thêm'} hợp đồng</h2>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã hợp đồng</label>
          <input
            type="text"
            value={contract.contractCode}
            onChange={(e) => setContract({ ...contract, contractCode: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Chủ nhà</label>
          <select
            value={contract.ownerId}
            onChange={(e) => setContract({ ...contract, ownerId: e.target.value })}
            required
          >
            <option value="">-- Chọn chủ nhà --</option>
            {owners.map(o => (
              <option key={o.ownerId} value={o.ownerId}>{o.fullName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ngày bắt đầu</label>
          <input
            type="datetime-local"
            value={contract.startDate}
            onChange={(e) => setContract({ ...contract, startDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày kết thúc</label>
          <input
            type="datetime-local"
            value={contract.endDate}
            onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <select
            value={contract.status}
            onChange={(e) => setContract({ ...contract, status: e.target.value })}
          >
            <option value="active">Active</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Lưu</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/contracts')}>Hủy</button>
        </div>
      </form>
    </div>
  );
}

export default ContractForm;
