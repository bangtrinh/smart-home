import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import './css/NotFoundPage.css';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
        
        <div className="not-found-actions">
          <Link to="/dashboard" className="back-to-dashboard">
            <HomeOutlined /> {t('notFound.backToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
