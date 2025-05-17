package com.project.IOT.services;

import com.project.IOT.DTOS.OTPDTO;

public interface OtpService {
    OTPDTO createOtp(Long ownerId);
    boolean verifyOtp(String otpCode, Long ownerId);
}