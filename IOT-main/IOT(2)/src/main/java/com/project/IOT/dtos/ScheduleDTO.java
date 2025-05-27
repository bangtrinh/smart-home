package com.project.IOT.DTOS;

import lombok.Data;

import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class ScheduleDTO {
    private Long id;
    private Long deviceId;
    private Long userId;
    private String action;
    private LocalDateTime scheduleTime;
}