package com.project.IOT.DTOS;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class assignControlConfirmDTO {
    String homeOwnerEmail;
    String otpCode;
    Long userId;
    Long objectId;
    String objectCode;
    private LocalDateTime endDate;
}
