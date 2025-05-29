import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="header">
      <div className="header-left">
        <button onClick={() => setCollapsed(!collapsed)}>
          {'☰'}
        </button>
        <h3>SmartHome Admin</h3>
      </div>
      <div className="header-right">
        {currentUser && (
          <>
            <span>Xin chào, {currentUser.username}</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Đăng xuất</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
