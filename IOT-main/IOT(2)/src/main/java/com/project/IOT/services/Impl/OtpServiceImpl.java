package com.project.IOT.services.Impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.IOT.DTOS.OTPDTO;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Entities.OTP;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.Repositories.OtpRepository;
import com.project.IOT.services.OtpService;
import com.project.IOT.Mapper.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {
    @Autowired
    private OtpRepository otpRepository;
    @Autowired
    private HomeOwnerRepository homeOwnerRepository;

    @Override
    @Transactional
    public OTPDTO createOtp(Long ownerId) {
        HomeOwner owner = homeOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        Optional<OTP> existingOtp = otpRepository.findByOtpCodeAndUsedFalse(otpCode);
        while (existingOtp.isPresent()) {
            otpCode = String.format("%06d", new Random().nextInt(999999));
            existingOtp = otpRepository.findByOtpCodeAndUsedFalse(otpCode);
        }
        OTP otp = new OTP();
        otp.setOtpCode(otpCode);
        otp.setOwner(owner);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otp.setCreatedAt(LocalDateTime.now());
        otp.setUsed(false);
        otpRepository.save(otp);
        return OTPMapper.toDto(otp);
    }

    @Override
    public boolean verifyOtp(String otpCode, Long ownerId) {
        OTP otp = otpRepository.findTopByOwnerIdAndOtpCodeOrderByCreatedAtDesc(ownerId, otpCode)
                .orElse(null);
        if (otp == null || otp.isUsed() || otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        otp.setUsed(true);
        otpRepository.delete(otp);
        return true;
    }
}