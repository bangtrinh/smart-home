import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyContracts, requestLinkToContract, confirmLinkToContract } from '../../api/contractApi';
import { Settings, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import '../css/layout/header.css';
import { useContract } from '../../context/ContractContext';
import { useWS } from '../../context/WebSocketContext'; 

function Header({ collapsed, setCollapsed }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLinkContractForm, setShowLinkContractForm] = useState(false);
  const [newContractCode, setNewContractCode] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [isWaitingOtp, setIsWaitingOtp] = useState(false);
  const [roles, setRoles] = useState([]);

  const { selectedContractId, setSelectedContractId } = useContract();
  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWS(); // <- lấy websocket API từ context

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      const roles = JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles'));
      setRoles(roles);
      console.log(roles);
    }
    const savedNoti = localStorage.getItem('notifications');
    if (savedNoti) {
      setNotifications(JSON.parse(savedNoti));
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
  }, []);

  useEffect(() => {
    if (!selectedContractId || !connected) return;

    const topic = `/contract/${selectedContractId}/notifications`;
    const subId = subscribeToTopic(topic, (rawMessage) => {
      const notification = JSON.parse(rawMessage);
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      if (subId) unsubscribeFromTopic(subId);
    };
  }, [selectedContractId, connected, subscribeToTopic, unsubscribeFromTopic]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/edit-profile');
    setShowDropdown(false);
  };

  const handleRequestLinkContract = async () => {
    try {
      const request = {
        objectCode: newContractCode,
        userId: currentUser.id
      };
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
          {!roles.includes('ADMIN') && (
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
          )}
        </div>
     

        {/* Right section: actions */}
        <div className="header-actions">
          <button className="icon-button">
            <Settings className="icon" />
          </button>

          {!roles.includes('ADMIN') && (
            <button className="icon-button notification-btn" onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}>
              <Bell className="icon" />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
          )}

          {showNotificationDropdown && (
            <div className="notification-dropdown">
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-item empty">Không có thông báo mới</div>
                ) : (
                  notifications.map((noti, idx) => (
                    <div key={idx} className="notification-item">
                      <span className="time">{new Date(noti.timestamp).toLocaleTimeString()}</span>
                      <p>{noti.message}</p>
                    </div>
                  ))
                )}
              </div>
              {roles.includes('OWNER') && (
                <button
                  onClick={() => {
                    setNotifications([]);
                    localStorage.removeItem('notifications');
                  }}
                  className="clear-button"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
          )}
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
                        navigate('/change-password');
                        setShowDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      <Settings className="dropdown-icon" />
                      Change Password
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
