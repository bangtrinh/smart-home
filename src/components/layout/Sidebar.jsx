import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Server,
  Bell,
  Shield,
  MapPin,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import '../css/layout/sidebar.css';

function Sidebar({ collapsed, setCollapsed }) {
  const roles = JSON.parse(localStorage.getItem('roles') || sessionStorage.getItem('roles') || '[]');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <nav>
        <button className="nav-link toggle-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />} 
        </button>

        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <Home size={20} />
          {!collapsed && <span className="link-label">Dashboard</span>}
        </Link>

        <Link
          to={roles.includes('ADMIN') ? '/devices' : '/my-devices'}
          className={`nav-link ${isActive('/devices') || isActive('/my-devices') ? 'active' : ''}`}
        >
          <Server size={20} />
          {!collapsed && <span className="link-label">Thiết bị</span>}
        </Link>

        <Link
          to={roles.includes('ADMIN') ? '/contracts' : '/my-contracts'}
          className={`nav-link ${isActive('/contracts') || isActive('/my-contracts') ? 'active' : ''}`}
        >
          <Bell size={20} />
          {!collapsed && <span className="link-label">Hợp đồng</span>}
        </Link>
        {(roles.includes('OWNER') || roles.includes('MEMBER')) && (
          <Link to="/devices/history" className={`nav-link ${isActive('/devices/history') ? 'active' : ''}`}>
            <Clock size={20} />
            {!collapsed && <span className="link-label">Lịch sử</span>}
          </Link>
        )}

        {roles.includes('ADMIN') && (
          <Link to="/homeowners" className={`nav-link ${isActive('/homeowners') ? 'active' : ''}`}>
            <Shield size={20} />
            {!collapsed && <span className="link-label">Chủ nhà</span>}
          </Link>
        )}

        {roles.includes('ADMIN') && (
          <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>
            <MapPin size={20} />
            {!collapsed && <span className="link-label">Người dùng</span>}
          </Link>
        )}
      </nav>

      {/* Logout button ở dưới cùng */}
      <button className="nav-link logout-button" onClick={handleLogout}>
        <LogOut size={20} />
        {!collapsed && <span className="link-label">Đăng xuất</span>}
      </button>
    </div>
  );
}

export default Sidebar;
