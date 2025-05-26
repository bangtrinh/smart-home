package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControl;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceControlRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.DeviceService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
    @Autowired
    private DeviceControlRepository deviceControlRepository;
    

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
        Set<Contract> contracts = user.getContracts();
        if (contracts.isEmpty()) {
            return new ArrayList<>();
        }
        List<DeviceDTO> deviceDTOs = new ArrayList<>();
        for (Contract contract : contracts) {
            List<Device> devices = deviceRepository.findByContractId(contract.getId());
            for (Device device : devices) {
                DeviceDTO dto = DeviceMapper.toDto(device);
                deviceDTOs.add(dto);
            }
        }
        return deviceDTOs;
    }

    @Override
    public List<DeviceDTO> getDevicesByUserAndContract(Long userId, Long contractId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Contract contract = contractRepository.findById(contractId)  
                .orElseThrow(() -> new RuntimeException("Contract not found"));      
        if (!user.getContracts().contains(contract)) {
            throw new RuntimeException("User does not have access to this contract");
        }
        List<Device> devices = deviceRepository.findByContractId(contractId);
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
        UserAccount owner = userAccountRepository.findByEmail(contract.getOwner().getEmail())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        DeviceControl deviceControl = new DeviceControl();
        deviceControl.setUser(owner);
        deviceControl.setDevice(device);
        deviceControl.setStartDate(LocalDateTime.now());
        deviceControl.setEndDate(LocalDateTime.now().plusYears(1000)); 
        deviceControl = deviceControlRepository.save(deviceControl);
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
