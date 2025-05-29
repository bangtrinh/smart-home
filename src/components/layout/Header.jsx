import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../api/contractApi';
import { Settings, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import '../css/layout/header.css';

function Header({ collapsed, setCollapsed, selectedContractId, setSelectedContractId }) {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLinkContractForm, setShowLinkContractForm] = useState(false);
  const [newContractCode, setNewContractCode] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [isWaitingOtp, setIsWaitingOtp] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await getMyContracts();
      setContracts(data);
      if (data.length > 0 && !selectedContractId) {
        setSelectedContractId(data[0].contractId);
      }
    } catch (error) {
      console.error('Failed to load contracts', error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [selectedContractId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleRequestLinkContract = async () => {
    try {
      const request = {
        objectCode: newContractCode,
        userId: currentUser.id
      }
      const res = await requestLinkToContract(request);
      setRequestId(res.data.requestId);
      setIsWaitingOtp(true);
      alert('Mã OTP đã được gửi!');
    } catch (error) {
      console.error('Request link contract failed', error);
      alert('Liên kết hợp đồng thất bại!');
    }
  };

  const handleConfirmLinkContract = async () => {
    try {
      const confirm = {
        contractCode: newContractCode,
        otpCode: otp,
        userId: currentUser.id
      };
      await confirmLinkToContract(confirm);
      await fetchContracts();
      setShowLinkContractForm(false);
      setNewContractCode('');
      setOtp('');
      setIsWaitingOtp(false);
      setRequestId(null);
      alert('Liên kết hợp đồng thành công!');
    } catch (error) {
      console.error('Confirm link contract failed', error);
      alert('Xác thực OTP thất bại!');
    }
  };

  return (
    <header className={`dashboard-header ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-content">
        {/* Left section: contract selector */}
        <div className="header-left">
          <div className="contract-select-container">
            <select
              value={selectedContractId}
              onChange={(e) => {
                if (e.target.value === 'add') {
                  setShowLinkContractForm(true);
                } else {
                  setSelectedContractId(e.target.value);
                }
              }}
              className="contract-select"
            >
              {contracts.map((contract) => (
                <option key={contract.contractId} value={contract.contractId}>
                  {contract.contractCode}
                </option>
              ))}
              <option value="add">Thêm...</option>
            </select>
          </div>
        </div>

        {/* Right section: actions */}
        <div className="header-actions">
          <button className="icon-button">
            <Settings className="icon" />
          </button>

          <button className="icon-button notification-btn">
            <Bell className="icon" />
            <span className="notification-badge"></span>
          </button>

          {/* User Dropdown */}
          {currentUser && (
            <div className="user-dropdown-container">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="user-button"
              >
                <div className="user-avatar">
                  <span>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser.username || 'User'}</div>
                </div>
                <ChevronDown className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="dropdown-backdrop"
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="user-name">{currentUser.username}</div>
                      <div className="user-email">{currentUser.email}</div>
                    </div>

                    <button onClick={handleProfile} className="dropdown-item">
                      <User className="dropdown-icon" />
                      Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      <Settings className="dropdown-icon" />
                      App Settings
                    </button>

                    <hr className="dropdown-divider" />

                    <button onClick={handleLogout} className="dropdown-item danger">
                      <LogOut className="dropdown-icon" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Link Contract Modal */}
      {showLinkContractForm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowLinkContractForm(false)}></div>
          <div className="modal">
            <h3>{isWaitingOtp ? 'Nhập OTP xác thực' : 'Nhập mã hợp đồng để liên kết'}</h3>

            {!isWaitingOtp ? (
              <>
                <input
                  type="text"
                  value={newContractCode}
                  onChange={(e) => setNewContractCode(e.target.value)}
                  placeholder="Nhập mã hợp đồng..."
                  className="modal-input"
                />
                <div className="modal-actions">
                  <button onClick={handleRequestLinkContract} className="modal-confirm-btn">Gửi yêu cầu</button>
                  <button onClick={() => setShowLinkContractForm(false)} className="modal-cancel-btn">Hủy</button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Nhập mã OTP..."
                  className="modal-input"
                />
                <div className="modal-actions">
                  <button onClick={handleConfirmLinkContract} className="modal-confirm-btn">Xác nhận</button>
                  <button onClick={() => setShowLinkContractForm(false)} className="modal-cancel-btn">Hủy</button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
