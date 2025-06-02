import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import '../css/style.css'; // Ensure you have the correct path to your CSS file
import { ContractProvider } from '../../context/ContractContext'; // Import ContextProvider vào

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ContractProvider>
      <div className={`admin-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div className="main-layout">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                              {children}
          </div>
        </div>
        <Footer isSidebarCollapsed={collapsed} />
      </div>
    </ContractProvider>
  );
}

export default AdminLayout;
