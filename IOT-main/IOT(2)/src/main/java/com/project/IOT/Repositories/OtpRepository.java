package com.project.IOT.Repositories;

import com.project.IOT.Entities.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByOtpCodeAndUsedFalse(String otpCode);

    OTP findByOtpCodeAndOwnerId(String otpCode, Long ownerId);
}
