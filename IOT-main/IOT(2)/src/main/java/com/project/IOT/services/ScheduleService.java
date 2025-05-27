package com.project.IOT.services;

import com.project.IOT.DTOS.ScheduleDTO;

import java.util.List;

public interface ScheduleService {
    ScheduleDTO createSchedule(ScheduleDTO scheduleDTO);
    List<ScheduleDTO> getSchedules(Long deviceId);
    void cancelSchedule(Long scheduleId);
    void checkAndExecuteSchedules();
    ScheduleDTO findById(Long id);
    ScheduleDTO update(ScheduleDTO scheduleDTO);
}