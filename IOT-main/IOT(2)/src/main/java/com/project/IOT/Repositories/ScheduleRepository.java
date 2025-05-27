package com.project.IOT.Repositories;

import com.project.IOT.Entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Tìm tất cả lịch hẹn giờ của một thiết bị
    List<Schedule> findByDeviceId(Long deviceId);

    // Tìm các lịch hẹn giờ trong khoảng thời gian để thực thi
    List<Schedule> findByScheduleTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
}