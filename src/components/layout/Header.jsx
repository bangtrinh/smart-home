import React from 'react';

function Header({ collapsed, setCollapsed }) {
  return (
    <div className="header">
      <div className="header-left">
        <button onClick={() => setCollapsed(!collapsed)}>
          {'☰'}
        </button>
        <h3>SmartHome Admin</h3>
      </div>
      <div>Xin chào, admin</div>
    </div>
  );
}

export default Header;
