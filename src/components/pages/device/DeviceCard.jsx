import React from 'react';
import { Link } from 'react-router-dom';
import DeviceControlActions from './DeviceControlActions';

function DeviceCard({ device, onDelete, onClick, isSubscribed, onSubscribe, onUnsubscribe, userId }) {
  return (
    <div
      className={`contract-card ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="contract-card-header">
        <h3>{device.deviceName}</h3>
        <span className={`status ${device.status === '*A: 1' ? 'on' : 'off'}`}>
          {device.status === '*A: 1' ? 'On' : 'Off'}
        </span>
      </div>

      <div className="contract-card-body">
        <p><strong>ID:</strong> {device.id}</p>
        <p><strong>Trạng thái:</strong> {device.status === '*A: 1' ? 'On' : 'Off'}</p>
      </div>

      <div className="contract-card-actions space-y-2">
        {onDelete && (
          <>
            <Link
              to={`/devices/edit/${device.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              ✏️ Sửa
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(device.id);
              }}
            >
              🗑️ Xoá
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
