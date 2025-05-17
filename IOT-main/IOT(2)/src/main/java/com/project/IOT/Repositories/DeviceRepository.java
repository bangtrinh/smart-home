package com.project.IOT.Repositories;

import com.project.IOT.Entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByContractId(Long contractId);
}
