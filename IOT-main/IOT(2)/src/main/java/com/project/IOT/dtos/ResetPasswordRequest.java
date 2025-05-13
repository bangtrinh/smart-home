package com.project.IOT.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
}
