import React, { useEffect, useState } from 'react';
import { checkControlActive } from '../../../api/deviceControlApi';
import { getDevicesByContractId } from '../../../api/deviceApi';
import DeviceCard from './DeviceCard';
import DeviceControlActions from './DeviceControlActions'; 

function UserDevicesControlList({ userId, contractId }) {
  console.log("Props vào UserDevicesControlList:", userId, contractId);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (userId && contractId) {
      fetchControlledDevices();
    }
  }, [userId, contractId]);

  const fetchControlledDevices = async () => {
    if (!contractId) {
      console.warn('Thiếu contractId!');
      return;
    }
    try {
      const res = await getDevicesByContractId(contractId);
      const deviceList = res.data;
      const controlledDevices = [];

      for (const device of deviceList) {
        const controlRes = await checkControlActive(userId, device.id);
        if (controlRes.data) {
          controlledDevices.push(device);
        }
      }

      setDevices(controlledDevices);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {devices.length > 0 ? (
        devices.map((device) => (
            <DeviceCard key={device.id} device={device} userId={userId} />
        ))
      ) : (
        <p>Không có thiết bị nào.</p>
      )}
    </div>
  );
}

export default UserDevicesControlList;
