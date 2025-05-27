package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.DeviceControlHistoryDTO;
import com.project.IOT.DTOS.MqttDTO;
import com.project.IOT.DTOS.ScheduleDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControlHistory;
import com.project.IOT.Entities.Schedule;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceControlHistoryMapper;
import com.project.IOT.Mapper.ScheduleMapper;
import com.project.IOT.Repositories.DeviceControlHistoryRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.ScheduleRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.MqttService;
import com.project.IOT.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private DeviceControlHistoryRepository deviceControlHistoryRepository;

    @Autowired
    private MqttService mqttService;

    @Override
    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO) {
        Device device = deviceRepository.findById(scheduleDTO.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found with ID: " + scheduleDTO.getDeviceId()));
        UserAccount userAccount = userAccountRepository.findById(scheduleDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + scheduleDTO.getUserId())); 
        // Ánh xạ từ request sang entity
        Schedule schedule = ScheduleMapper.toEntity(scheduleDTO, device, userAccount);
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Ánh xạ trở lại DTO để trả về
        return ScheduleMapper.toDTO(savedSchedule);
    }

    @Override
    public List<ScheduleDTO> getSchedules(Long deviceId) {
        return scheduleRepository.findByDeviceId(deviceId)
                .stream()
                .map(ScheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleId));
        scheduleRepository.delete(schedule);
    }

    @Override
    public void checkAndExecuteSchedules() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = now.minusSeconds(60);
        LocalDateTime endTime = now.plusSeconds(60);

        List<Schedule> pendingSchedules = scheduleRepository.findByScheduleTimeBetween(startTime, endTime);

        for (Schedule schedule : pendingSchedules) {
            try {
                Device device = schedule.getDevice();
                Contract contract = device.getContract();
                if (contract == null) {
                    throw new RuntimeException("Contract not found for device ID: " + device.getId());
                }
                UserAccount userAccount = schedule.getUserAccount();

                MqttDTO mqttDTO = new MqttDTO();
                mqttDTO.setContractId(contract.getId());
                mqttDTO.setDeviceId(device.getId());
                mqttDTO.setValue(schedule.getAction());

                String result = mqttService.publishMessage(mqttDTO, userAccount);
                System.out.println(result);

                device.setStatus(schedule.getAction());
                deviceRepository.save(device);

                DeviceControlHistoryDTO historyDTO = new DeviceControlHistoryDTO();
                historyDTO.setActionTimestamp(LocalDateTime.now());
                historyDTO.setAction(schedule.getAction());
                DeviceControlHistory history = DeviceControlHistoryMapper.toEntity(historyDTO, userAccount, device, contract);
                deviceControlHistoryRepository.save(history);

                // Xóa lịch sau khi thực thi
                scheduleRepository.delete(schedule);
            } catch (Exception e) {
                System.err.println("Failed to execute schedule ID " + schedule.getId() + ": " + e.getMessage());
            }
        }
    }

    @Override
    public ScheduleDTO findById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + id));
        return ScheduleMapper.toDTO(schedule);
    }

    @Override
    public ScheduleDTO update(ScheduleDTO scheduleDTO) {
        Schedule existingSchedule = scheduleRepository.findById(scheduleDTO
                .getId())
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleDTO.getId()));
        Device device = deviceRepository.findById(scheduleDTO
                .getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found with ID: " + scheduleDTO.getDeviceId()));
        UserAccount userAccount = userAccountRepository.findById(scheduleDTO
                .getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + scheduleDTO.getUserId()));
        // Cập nhật các trường cần thiết
        existingSchedule.setDevice(device);
        existingSchedule.setUserAccount(userAccount);
        existingSchedule.setAction(scheduleDTO.getAction());
        existingSchedule.setScheduleTime(scheduleDTO.getScheduleTime());
        // Lưu lại lịch đã cập nhật
        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
        // Trả về DTO đã cập nhật
        return ScheduleMapper.toDTO(updatedSchedule);
    }
}