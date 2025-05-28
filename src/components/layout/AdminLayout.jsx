import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import '../css/style.css'; // Ensure you have the correct path to your CSS file

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');

  return (
    <div className={`admin-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedContractId={selectedContractId}
        setSelectedContractId={setSelectedContractId}
      />
      <div className="main-layout">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
          {/* cloneElement children để truyền selectedContractId */}
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { selectedContractId })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;
