package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.DeviceService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class DeviceServiceImpl implements DeviceService {
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    

    @Override
    public DeviceDTO findById(Long deviceId) {
        Device device = deviceRepository.findById(deviceId).orElse(null);
        if (device == null) {
            return null;
        }
        DeviceDTO deviceDTO = DeviceMapper.toDto(device);
        return deviceDTO;
    }

    @Override
    public List<DeviceDTO> getAllDevices() {
        List<Device> devices = deviceRepository.findAll();

        List<DeviceDTO> deviceDTOs = new ArrayList<>();
        for (Device device : devices) {
            DeviceDTO dto = DeviceMapper.toDto(device);
            deviceDTOs.add(dto);
        }
        return deviceDTOs;
    }

    @Override
    public List<DeviceDTO> getDevicesByUser(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
        List<Device> devices = deviceRepository.findByContractId(user.getContract().getId());
        if (devices.isEmpty()) {
            return new ArrayList<>();
        }
        List<DeviceDTO> deviceDTOs = new ArrayList<>();
        for (Device device : devices) {
            DeviceDTO dto = DeviceMapper.toDto(device);
            deviceDTOs.add(dto);
        }
        return deviceDTOs;
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
