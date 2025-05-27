package com.project.IOT.Runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.project.IOT.services.ScheduleService;

@Component
public class ScheduleTaskRunner {

    @Autowired
    private ScheduleService scheduleService;

    @Scheduled(fixedRate = 10000) // Chạy mỗi 10 giây
    public void run() {
        scheduleService.checkAndExecuteSchedules();
    }
}

