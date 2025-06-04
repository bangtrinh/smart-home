import React, { useState } from 'react';
import { createSchedule } from '../../../api/scheduleApi'; // bạn cần tạo API này
import { useTranslation } from 'react-i18next';

function DeviceScheduleForm({ deviceId, userId, onSuccess }) {
  const { t } = useTranslation();

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
      alert(t('deviceScheduleForm.successMessage'));
      onSuccess && onSuccess();
    } catch (err) {
      alert(t('deviceScheduleForm.failMessage'));
      console.log(payload);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <label className="block">
        {t('deviceScheduleForm.scheduleTimeLabel')}
        <input
          type="datetime-local"
          className="border rounded p-1 w-full"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          required
        />
      </label>

      <label className="block">
        {t('deviceScheduleForm.actionLabel')}
        <select
          className="border rounded p-1 w-full"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="*A: 1">{t('deviceScheduleForm.actionOn')}</option>
          <option value="*A: 0">{t('deviceScheduleForm.actionOff')}</option>
        </select>
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        ⏰ {t('deviceScheduleForm.submitButton')}
      </button>
    </form>
  );
}

export default DeviceScheduleForm;
