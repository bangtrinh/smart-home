import React, { useState, useEffect } from 'react';
import {
  assignControlRequest,
  assignControlConfirm,
  unassignControl,
  checkControlActive
} from '../../../api/deviceControlApi';
import '../../css/MyDevices.css'
import { Check } from 'lucide-react';

function DeviceControlActions({ userId, device, isSubscribed, onSubscribe, onUnsubscribe }) {
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isControlled, setIsControlled] = useState(false);

  useEffect(() => {
    fetchControlStatus();
  }, [userId, device.id]);

  const fetchControlStatus = async () => {
    try {
      const res = await checkControlActive(userId, device.id);
      setIsControlled(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestControl = async () => {
    try {
      await assignControlRequest({ userId, objectId: device.id });
      alert('Yêu cầu gửi OTP thành công!');
      setShowOtpInput(true);
    } catch (err) {
      alert('Không thể gửi yêu cầu điều khiển');
      console.error(err);
    }
  };

  const handleConfirmControl = async () => {
    if (!otp) {
      alert('Vui lòng nhập OTP!');
      return;
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const endDateISO = endDate.toISOString();

    const payload = {
      contractCode: device.contractCode,
      otpCode: otp,
      userId,
      objectId: device.id,
      endDate: endDateISO
    };

    try {
      await assignControlConfirm(payload);
      alert('Đăng ký điều khiển thành công!');
      setShowOtpInput(false);
      setIsControlled(true);
    } catch (err) {
      alert('OTP không hợp lệ hoặc lỗi xác nhận');
      console.error(err);
    }
  };

  const handleUnassignControl = async () => {
    if (window.confirm('Bạn có chắc muốn huỷ điều khiển thiết bị này?')) {
      try {
        await unassignControl({ userId, objectId: device.id });
        alert('Huỷ điều khiển thành công!');
        setIsControlled(false);
      } catch (err) {
        alert('Lỗi khi huỷ điều khiển');
        console.error(err);
      }
    }
  };

  return (
    <div className="device-control-actions">
      {isControlled ? (
        <button
          onClick={handleUnassignControl}
          className="btn-unsubscribe"
        >
          Huỷ đăng ký
        </button>
      ) : (
        !showOtpInput && (
          <button
            onClick={handleRequestControl}
            className="btn-subscribe"
          >
            Đăng ký
          </button>
        )
      )}

      {showOtpInput && (
        <div className="otp-section">
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button
            onClick={handleConfirmControl}
            className="btn-confirm"
          >
           <Check size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DeviceControlActions;
