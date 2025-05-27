import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import '../../style/style.css';

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container">
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-layout">
        <Sidebar collapsed={collapsed} />
        <div className="main-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;
