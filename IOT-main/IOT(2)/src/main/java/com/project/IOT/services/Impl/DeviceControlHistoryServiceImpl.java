package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.DeviceControlHistoryDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControlHistory;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceControlHistoryMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceControlHistoryRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.DeviceControlHistoryService;

import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DeviceControlHistoryServiceImpl implements DeviceControlHistoryService {
    @Autowired
    private DeviceControlHistoryRepository historyRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private ContractRepository contractRepository;

    @Override
    @Transactional
    public DeviceControlHistoryDTO saveHistory(String username, Long deviceId, String action, Long contractId) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        DeviceControlHistory history = new DeviceControlHistory();
        history.setUser(user);
        history.setDevice(device);
        history.setContract(contract);
        history.setAction(action);
        history.setActionTimestamp(LocalDateTime.now());
        history = historyRepository.save(history);
        return DeviceControlHistoryMapper.toDto(history);
    }
    @Override
    public List<DeviceControlHistoryDTO> getHistoryByHomeOwner(String username) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Contract> contracts = user.getContracts();
        if (contracts.isEmpty()) {
            throw new RuntimeException("No contracts found for user");
        }
        List<DeviceControlHistory> history = new ArrayList<>();
        for (Contract c : contracts) {
            history.addAll(historyRepository.findByContractId(c.getId()));
        }
        if (history.isEmpty()) {
            throw new RuntimeException("No history found for this user");
        }

        List<DeviceControlHistoryDTO> historyDTOs = new ArrayList<>();
        for (DeviceControlHistory h : history) {
            DeviceControlHistoryDTO dto = DeviceControlHistoryMapper.toDto(h);
            historyDTOs.add(dto);
        }
        return historyDTOs;
    }

    @Override
    public List<DeviceControlHistoryDTO> getAllControlHistory() {
        List<DeviceControlHistory> history = historyRepository.findAll();
        List<DeviceControlHistoryDTO> historyDTOs = new ArrayList<>();
        for (DeviceControlHistory h : history) {
            DeviceControlHistoryDTO dto = DeviceControlHistoryMapper.toDto(h);
            historyDTOs.add(dto);
        }
        return historyDTOs;
    }

    @Override
    public DeviceControlHistoryDTO getControlHistoryById(Long id) {
        DeviceControlHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Control history not found"));
        if (history == null) {
            throw new RuntimeException("Control history not found");
        }
        return DeviceControlHistoryMapper.toDto(history);
    }
}