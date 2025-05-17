package com.project.IOT.Repositories;

import com.project.IOT.Entities.DeviceControl;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceControlRepository extends JpaRepository<DeviceControl, Long> {
    List<DeviceControl> findByUserId(Long userId);
    Optional<DeviceControl> findByUserIdAndDeviceIdAndStatus(Long userId, Long deviceId, String string);
}
