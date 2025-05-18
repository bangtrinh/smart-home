package com.project.IOT.DTOS;

import lombok.Data;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeviceControlDTO {
    private Long controlId;
    private Long userId;
    private Long deviceId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
