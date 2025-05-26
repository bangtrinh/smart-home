import React, { useState, useEffect } from 'react';
import {
  assignControlRequest,
  assignControlConfirm,
  unassignControl,
  checkControlActive
} from '../../../api/deviceControlApi';

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
    <div style={{ marginTop: 8 }}>

      {/* Nút Đăng ký hoặc Huỷ điều khiển */}
      {isControlled ? (
        <button
          onClick={handleUnassignControl}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ❌ Huỷ điều khiển
        </button>
      ) : (
        !showOtpInput && (
          <button
            onClick={handleRequestControl}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📲 Đăng ký điều khiển
          </button>
        )
      )}

      {/* Khung nhập OTP */}
      {showOtpInput && (
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-1 mr-2 rounded"
          />
          <button
            onClick={handleConfirmControl}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅ Xác nhận
          </button>
        </div>
      )}

      {/* Nút Subscribe MQTT */}
      {onSubscribe && onUnsubscribe && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              isSubscribed ? onUnsubscribe(device) : onSubscribe(device);
            }}
            className={`px-3 py-1 rounded text-white ${
              isSubscribed ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {isSubscribed ? '📴 Huỷ đăng ký MQTT' : '📡 Đăng ký MQTT'}
          </button>
        </div>
      )}

    </div>
  );
}

export default DeviceControlActions;
