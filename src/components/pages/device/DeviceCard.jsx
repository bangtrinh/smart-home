import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DeviceControlActions from './DeviceControlActions';

function DeviceCard({ device, onDelete, onClick, userId, schedule }) {
  const { t } = useTranslation();

  return (
    <div
      className={`contract-card ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="contract-card-header">
        <h3>{device.deviceName}</h3>
      </div>

      <div className="contract-card-body">
        <p><strong>{t('id')}:</strong> {device.id}</p>
        <p>
          <strong>{t('status')}:</strong>{' '}
          {device.status === '*A: 1' ? t('on') : t('off')}
        </p>
      </div>

      <div className="contract-card-actions">
        {onDelete && (
          <>
            <Link
              to={`/devices/edit/${device.id}`}
              onClick={(e) => e.stopPropagation()}
              className="edit-device-btn"
            >
              {t('edit')}
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(device.id);
              }}
              className="delete-device-btn"
            >
              {t('delete')}
            </button>
          </>
        )}

        {userId && (
          <div onClick={(e) => e.stopPropagation()}>
            <DeviceControlActions userId={userId} device={device} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DeviceCard;
