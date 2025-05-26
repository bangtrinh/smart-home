package com.project.IOT.controllers;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.ContractService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contract")
public class ContractController {

    private final ContractService contractService;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public ContractController(ContractService contractService, UserAccountRepository userAccountRepository) {
        this.contractService = contractService;
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<ContractDTO>> getAllContracts() {
        List<ContractDTO> contracts = contractService.getAllContracts();
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<ContractDTO> getContractById(@PathVariable Long id) {
        ContractDTO contract = contractService.findById(id);
        if (contract == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(contract);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContractDTO> createContract(@RequestBody ContractDTO contract) {
        ContractDTO savedContract = contractService.createContract(contract);
        return ResponseEntity.status(201).body(savedContract);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContractDTO> updateContract(@PathVariable Long id, @RequestBody ContractDTO contract) {
        ContractDTO existingContract = contractService.findById(id);
        if (existingContract == null) {
            return ResponseEntity.status(404).body(null);
        }
        contract.setContractId(id);
        ContractDTO updatedContract = contractService.updateContract(id, contract);
        return ResponseEntity.ok(updatedContract);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        ContractDTO contract = contractService.findById(id);
        if (contract == null) {
            return ResponseEntity.status(404).build();
        }
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/request-link")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<String> requestLinkToContract(@RequestBody assignControlRequestDTO linkRequest, 
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        if (linkRequest.getUserId() == null) {
            UserAccount user = userAccountRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            linkRequest.setUserId(user.getId());
        }
        if (linkRequest.getObjectCode() == null) {
            return ResponseEntity.badRequest().body("Object Code is required");
        }
        //Nếu user đã liên kết với contract thì không cần gửi OTP
        if (contractService.isUserLinkedToContract(linkRequest.getUserId(), linkRequest.getObjectCode())) {
            return ResponseEntity.badRequest().body("User is already linked to this contract");
        }
        try {
            contractService.requestLinkToContract(linkRequest);
            return ResponseEntity.ok("OTP sent to HomeOwner for confirmation");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-link")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<String> confirmLinkToContract(@RequestBody assignControlConfirmDTO linkConfirm) {
        try {
            contractService.confirmLinkToContract(linkConfirm);
            return ResponseEntity.ok("User linked to contract successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to link user to contract: " + e.getMessage());
        }
    }

    @GetMapping("/my-contracts")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<List<ContractDTO>> getMyContracts(@AuthenticationPrincipal UserDetails userDetails) {
        UserAccount user = userAccountRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ContractDTO> contracts = contractService.getContractsByUser(user.getId());
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}/users")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<List<UserAccountDTO>> getUsersByContract(@PathVariable Long id) {
        List<UserAccountDTO> users = contractService.getUsersByContract(id);
        return ResponseEntity.ok(users);
    }
}

