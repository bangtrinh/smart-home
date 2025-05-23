package com.project.IOT.services.Impl;

import com.project.IOT.Mapper.DeviceControlHistoryMapper;
import com.project.IOT.DTOS.DeviceControlHistoryDTO;
import com.project.IOT.DTOS.MqttDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControlHistory;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Repositories.DeviceControlHistoryRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.services.MqttService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MqttServiceImpl implements MqttService {

    private final MqttClient mqttClient;
    private final SimpMessagingTemplate messagingTemplate;
    private final DeviceControlHistoryRepository deviceControlHistoryRepository;
    private final DeviceRepository deviceRepository;


    @Override
    public String publishMessage(MqttDTO mqttDTO, UserAccount userAccount) throws MqttException {
        MqttMessage mqttMessage = new MqttMessage(mqttDTO.getValue().getBytes());
        mqttMessage.setQos(1);

        //Tạo 1 path có dạng: /contract/{contractId}/device/{deviceId}/user/{userId}
        String path = String.format("/contract/%d/device/%d", mqttDTO.getContractId(), mqttDTO.getDeviceId());
        mqttClient.subscribe(path);

        // Publish đến MQTT broker
        mqttClient.publish(path, mqttMessage);

        // Gửi thông báo qua WebSocket tới client đang sub /topic/mqtt
        messagingTemplate.convertAndSend("/topic/mqtt", mqttDTO);
        // Lưu lịch sử điều khiển thiết bị
        DeviceControlHistoryDTO historyDTO = new DeviceControlHistoryDTO();
        historyDTO.setActionTimestamp(LocalDateTime.now());
        historyDTO.setAction(mqttDTO.getValue());

        // Tìm kiếm thiết bị theo ID
        Device device = deviceRepository.findById(mqttDTO.getDeviceId())
                .orElseThrow(() -> new EntityNotFoundException("Thiết bị không tồn tại"));
        
        device.setStatus(mqttMessage.toString());
        // Tìm kiếm hợp đồng theo ID
        Contract contract = device.getContract();
        if (contract == null) {
            throw new EntityNotFoundException("Hợp đồng không tồn tại");
        }
        // Chuyển đổi DTO thành Entity
        DeviceControlHistory history = DeviceControlHistoryMapper.toEntity(historyDTO, userAccount, device, contract);
        // Lưu lịch sử vào cơ sở dữ liệu
        deviceControlHistoryRepository.save(history);
        return "Đã publish: " + mqttDTO.getValue() + " tới topic: " + path;
    }
}