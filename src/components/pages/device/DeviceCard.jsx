import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeviceControlActions from './DeviceControlActions';
import DeviceScheduleForm from './DeviceScheduleForm';
import ToggleSwitch from './ToggleSwitch';

function DeviceCard({ device, onDelete, onToggle, userId, schedule }) {
  const [showScheduler, setShowScheduler] = useState(false);
  const isOn = device.status === '*A: 1';

  return (
    <div className="device-card" onClick={() => onToggle(device)}>
      
      <div>
        <div className="device-card-header">
          <h3 className="text-xl font-semibold text-green-700">{device.deviceName}</h3>
          <span className={`device-status-badge ${isOn ? 'on' : 'off'}`}>
            {isOn ? 'On' : 'Off'}
          </span>
        </div>

        <div className="device-info">
          <p><strong>ID:</strong> {device.id}</p>
          <p><strong>Trạng thái:</strong> {isOn ? 'On' : 'Off'}</p>
        </div>
      </div>

      <div className="device-card-actions" onClick={e => e.stopPropagation()}>
        {onDelete && (
          <>
            <Link
              to={`/devices/edit/${device.id}`}
              className="edit-btn"
            >
              ✏️ Sửa
            </Link>
            <button
              onClick={() => onDelete(device.id)}
              className="delete-btn"
            >
              🗑️ Xoá
            </button>
          </>
        )}

        {userId && (
          <DeviceControlActions userId={userId} device={device} />
        )}

        <div className="toggle-switch-container">
          <ToggleSwitch checked={isOn} onChange={() => onToggle(device)} />
        </div>

        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="schedule-toggle-btn"
        >
          ⏰ {showScheduler ? 'Đóng hẹn giờ' : 'Hẹn giờ'}
        </button>

        {schedule && showScheduler && (
          <div className="device-scheduler">
            <DeviceScheduleForm deviceId={device.id} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}


export default DeviceCard;
