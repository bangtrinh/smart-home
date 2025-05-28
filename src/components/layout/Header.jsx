import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyContract, getMyContracts } from '../../api/contractApi';
import { Search, Settings, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import '../css/layout/header.css';

function Header({ collapsed, setCollapsed, selectedContractId, setSelectedContractId }) {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const fetchContracts = async () => {
      try {
        const data = await getMyContracts();
        setContracts(data);
        if (data.length > 0) setSelectedContractId(data[0].contractId);
      } catch (error) {
        console.error('Failed to load contracts', error);
      }
    };

    fetchContracts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <header className={`dashboard-header ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-content">
        {/* Empty left space */}
        <div className="header-left">
          <div className="contract-select-container">
            <select
              value={selectedContractId}
              onChange={(e) => {
                setSelectedContractId(e.target.value);
                console.log(e.target.value);  // đây sẽ log ra contract.id
              }}
              className="contract-select"
            >
              <option value="">Select a Contract</option>
              {contracts.map((contract) => (
                <option key={contract.contractId} value={contract.contractId}>
                  {contract.contractCode}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Right Section - Settings, Bell and User */}
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
                  <span>
                    {currentUser.username?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser.username || 'Scarlett'}</div>
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
                      <div className="user-name">{currentUser.username || 'Scarlett'}</div>
                      <div className="user-email">{currentUser.email || 'admin@smarthome.com'}</div>
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
    </header>
  );
}

export default Header;