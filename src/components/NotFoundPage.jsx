import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons'; // Hoặc sử dụng icon khác
import './css/NotFoundPage.css'

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Trang không tồn tại</h1>
        <p>Xin lỗi, đường dẫn bạn truy cập hiện không khả dụng hoặc đã bị xóa.</p>
        
        <div className="not-found-actions">
          <Link to="/dashboard" className="back-to-dashboard">
            <HomeOutlined /> Quay lại Bảng điều khiển
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;