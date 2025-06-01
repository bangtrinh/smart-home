import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import DeviceControlActions from './DeviceControlActions';


function DeviceCard({ device, onDelete, onClick, userId, schedule }) {
  const [showScheduler, setShowScheduler] = useState(false); 
  return (
    <div
      className={`contract-card ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="contract-card-header">
        <h3>{device.deviceName}</h3>
      </div>

      <div className="contract-card-body">
        <p><strong>ID:</strong> {device.id}</p>
        <p><strong>Trạng thái:</strong> {device.status === '*A: 1' ? 'On' : 'Off'}</p>
      </div>

      <div className="contract-card-actions">
        {onDelete && (
          <>
            <Link
              to={`/devices/edit/${device.id}`}
              onClick={(e) => e.stopPropagation()}
              className="edit-device-btn"
            >
              Sửa
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(device.id);
              }}
              className="delete-device-btn"
            >
              Xoá
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
