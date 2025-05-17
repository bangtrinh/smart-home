package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Mapper.DeviceMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class DeviceServiceImpl implements DeviceService {
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private ContractRepository contractRepository;
    

    @Override
    public Device findById(Long deviceId) {
        return deviceRepository.findById(deviceId).orElse(null);
    }

    @Override
    @Transactional
    public DeviceDTO createDevice(DeviceDTO dto) {
        //find contract
        Contract contract = contractRepository.findById(dto.getContractId()).orElse(null);
        if(contract == null){
            throw new RuntimeException("Contract not found");
        }
        Device device = DeviceMapper.toEntity(dto, contract);
        device = deviceRepository.save(device);
        return DeviceMapper.toDto(device);
    }

    @Override
    @Transactional
    public DeviceDTO updateDevice(Long deviceId, DeviceDTO dto) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        device.setDeviceName(dto.getDeviceName());
        device.setStatus(dto.getStatus());
        device = deviceRepository.save(device);
        return DeviceMapper.toDto(device);
    }

    @Override
    public void deleteDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        deviceRepository.delete(device);
    }
}
