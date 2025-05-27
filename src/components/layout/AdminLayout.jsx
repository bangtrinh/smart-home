import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import RightSidebar from '../layout/RightSidebar'; // Sửa đường dẫn import

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container">
      {/* Truyền collapsed và setCollapsed vào Header để Header có thể gọi toggle */}
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-layout">
        {/* Truyền collapsed và setCollapsed (nếu Sidebar cần toggle từ đó) */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;
