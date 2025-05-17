package com.project.IOT.Repositories;

import com.project.IOT.Entities.DeviceControlHistory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceControlHistoryRepository extends JpaRepository<DeviceControlHistory, Long> {
    List<DeviceControlHistory> findByUserId(Long userId);
    List<DeviceControlHistory> findByDeviceId(Long deviceId);
    List<DeviceControlHistory> findByContractId(Long contractId);
}
