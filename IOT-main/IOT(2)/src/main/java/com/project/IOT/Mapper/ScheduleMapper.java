package com.project.IOT.Mapper;

import org.springframework.stereotype.Component;

import com.project.IOT.DTOS.ScheduleDTO;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.Schedule;
import com.project.IOT.Entities.UserAccount;

@Component
public class ScheduleMapper {

    // Method to convert ScheduleDTO to Schedule entity
    public static Schedule toEntity(ScheduleDTO scheduleDTO, Device device, UserAccount userAccount) {
        if (scheduleDTO == null) {
            return null;
        }

        return Schedule.builder()
                .id(scheduleDTO.getId())
                .device(device)
                .userAccount(userAccount)
                .action(scheduleDTO.getAction())
                .scheduleTime(scheduleDTO.getScheduleTime())
                .build();
    }

    // Method to convert Schedule entity to ScheduleDTO
    public static ScheduleDTO toDTO(Schedule schedule) {
        if (schedule == null) {
            return null;
        }

        return ScheduleDTO.builder()
                .id(schedule.getId())
                .deviceId(schedule.getDevice() != null ? schedule.getDevice().getId() : null)
                .userId(schedule.getUserAccount() != null ? schedule.getUserAccount().getId() : null)
                .action(schedule.getAction())
                .scheduleTime(schedule.getScheduleTime())
                .build();
    }
}
