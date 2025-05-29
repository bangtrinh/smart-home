import React, { useState } from 'react';
import { createSchedule } from '../../../api/scheduleApi'; // bạn cần tạo API này

function DeviceScheduleForm({ deviceId, userId, onSuccess }) {
  const [scheduleTime, setScheduleTime] = useState('');
  const [action, setAction] = useState('*A: 1'); // Mặc định là bật thiết bị

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      deviceId,
      userId,
      action,
      scheduleTime
    };

    try {
      await createSchedule(payload);
      alert('Đã hẹn giờ thành công!');
      onSuccess && onSuccess();
    } catch (err) {
      alert('Hẹn giờ thất bại');
      console.log(payload)
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <label className="block">
        Thời gian thực hiện:
        <input
          type="datetime-local"
          className="border rounded p-1 w-full"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          required
        />
      </label>

      <label className="block">
        Hành động:
        <select
          className="border rounded p-1 w-full"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="*A: 1">Bật</option>
          <option value="*A: 0">Tắt</option>
        </select>
      </label>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        ⏰ Hẹn giờ
      </button>
    </form>
  );
}

export default DeviceScheduleForm;
