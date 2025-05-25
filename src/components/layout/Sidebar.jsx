import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Server, FileText, Users, User } from 'lucide-react';

function Sidebar({ collapsed }) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav>
        <Link to="/dashboard"><Home size={18} /><span>Dashboard</span></Link>
        <Link to="/devices"><Server size={18} /><span>Thiết bị</span></Link>
        <Link to="/contracts"><FileText size={18} /><span>Hợp đồng</span></Link>
        <Link to="/homeowners"><Users size={18} /><span>Chủ nhà</span></Link>
        <Link to="/users"><User size={18} /><span>Người dùng</span></Link>
      </nav>
    </div>
  );
}

export default Sidebar;
