import React, { useState, useEffect } from 'react';
import {
  assignControlRequest,
  assignControlConfirm,
  unassignControl,
  checkControlActive
} from '../../../api/deviceControlApi';
import '../../css/MyDevices.css'
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function DeviceControlActions({ userId, device, isSubscribed, onSubscribe, onUnsubscribe }) {
  const { t } = useTranslation();
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
      alert(t('deviceControlActions.requestSuccess'));
      setShowOtpInput(true);
    } catch (err) {
      alert(t('deviceControlActions.requestFail'));
      console.error(err);
    }
  };

  const handleConfirmControl = async () => {
    if (!otp) {
      alert(t('deviceControlActions.otpPlaceholder'));
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
      alert(t('deviceControlActions.confirmSuccess'));
      setShowOtpInput(false);
      setIsControlled(true);
    } catch (err) {
      alert(t('deviceControlActions.confirmFail'));
      console.error(err);
    }
  };

  const handleUnassignControl = async () => {
    if (window.confirm(t('deviceControlActions.unsubscribeConfirm'))) {
      try {
        await unassignControl({ userId, objectId: device.id });
        alert(t('deviceControlActions.unsubscribeSuccess'));
        setIsControlled(false);
      } catch (err) {
        alert(t('deviceControlActions.unsubscribeFail'));
        console.error(err);
      }
    }
  };

  return (
    <div className="device-control-actions">
      {isControlled ? (
        <button onClick={handleUnassignControl} className="btn-unsubscribe">
          {t('deviceControlActions.unsubscribe')}
        </button>
      ) : (
        !showOtpInput && (
          <button onClick={handleRequestControl} className="btn-subscribe">
            {t('deviceControlActions.subscribe')}
          </button>
        )
      )}

      {showOtpInput && (
        <div className="otp-section">
          <input
            type="text"
            placeholder={t('deviceControlActions.otpPlaceholder')}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button onClick={handleConfirmControl} className="btn-confirm">
            <Check size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DeviceControlActions;
