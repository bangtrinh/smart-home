import React from 'react';
import '../css/layout/footer.css';

function Footer({ isSidebarCollapsed }) {
  return (
    <div className={`app-footer ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="footer-left">© 2024 SmartHome</div>
      <div className="footer-right">Made by Trinh Vu</div>
    </div>
  );
}

export default Footer;
