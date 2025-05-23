package com.project.IOT.Repositories;

import com.project.IOT.Entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findByEmail(String email);
    List<UserAccount> findByContracts_Id(Long contractId);
}
