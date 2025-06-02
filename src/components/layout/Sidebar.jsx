import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/Sidebar.css';

import { Home, Server, FileText, Users, User } from 'lucide-react';

function Sidebar({ collapsed }) {
  const roles = JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]'); // parse về mảng

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav>
        <Link to="/dashboard"><Home size={18} /><span>Dashboard</span></Link>
        { roles.includes('ADMIN') ? (
          <Link to="/devices"><Server size={18} /><span>Thiết bị</span></Link>
        ) : (
          <Link to="/my-devices"><Server size={18} /><span>Thiết bị của tôi</span></Link>
        )}

        {roles.includes('ADMIN') ? (
          <Link to="/contracts"><FileText size={18} /><span>Hợp đồng</span></Link>
        ) : (
          <Link to="/my-contracts"><FileText size={18} /><span>Hợp đồng của tôi</span></Link>
        )}

        {roles.includes('ADMIN') && (
          <Link to="/homeowners"><Users size={18} /><span>Chủ nhà</span></Link>
        )}
        {roles.includes('ADMIN') && (
          <Link to="/users"><User size={18} /><span>Người dùng</span></Link>
        )}

      </nav>
    </div>
  );
}
export default Sidebar;
