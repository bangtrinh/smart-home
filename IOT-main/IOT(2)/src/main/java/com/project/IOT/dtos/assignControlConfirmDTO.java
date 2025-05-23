package com.project.IOT.DTOS;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class assignControlConfirmDTO {
    String contractCode;
    String otpCode;
    Long userId;
    Long objectId;
    private LocalDateTime endDate;
}
