package com.project.IOT.Repositories;

import com.project.IOT.Entities.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByContractCode(String contractCode);
    Optional<Contract> findById(Long id);
    List<Contract> findByOwnerId(Long ownerId);
}
