package com.project.IOT.services.Impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.DTOS.OTPDTO;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.ContractMapper;
import com.project.IOT.Mapper.UserAccountMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.ContractService;
import com.project.IOT.services.EmailService;
import com.project.IOT.services.OtpService;

import io.jsonwebtoken.lang.Collections;

import java.util.Optional;


@Service
public class ContractServiceImpl implements ContractService {
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private HomeOwnerRepository homeOwnerRepository;
    @Autowired
    private OtpService otpService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public ContractDTO findById(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        ContractDTO contractDTO = ContractMapper.toDto(contract);
        return contractDTO;
    }

    @Override
    public List<ContractDTO> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();
        List<ContractDTO> contractDTOs = new ArrayList<>();
        for (Contract contract : contracts) {
            ContractDTO contractDTO = ContractMapper.toDto(contract);
            contractDTOs.add(contractDTO);
        }
        return contractDTOs;
    }

    @Override
    public List<ContractDTO> getContractsByUser(Long userId) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Contract> contracts = userAccount.getContracts();
        return contracts.stream().map(ContractMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<UserAccountDTO> getUsersByContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        Set<UserAccount> users = contract.getUsers();
        if (users == null || users.isEmpty()) {
            return new ArrayList<>();
        }
        return users.stream().map(UserAccountMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public ContractDTO createContract(ContractDTO dto) {
        // Tìm chủ nhà
        HomeOwner owner = homeOwnerRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        // Tạo contract từ DTO
        Contract contract = ContractMapper.toEntity(dto, owner);
        //Lưu contract
        contract = contractRepository.save(contract);
        // Kiểm tra và xử lý user account
        Optional<UserAccount> existingUser = userAccountRepository.findByEmail(owner.getEmail());
        UserAccount userAccount;
        
        if (!existingUser.isPresent()) {
            // Tạo userAccount mới cho homeOwner
            UserAccountDTO userAccountDTO = new UserAccountDTO();
            userAccountDTO.setUsername(owner.getEmail());
            userAccountDTO.setPassword("defaultPassword");
            userAccountDTO.setEmail(owner.getEmail());
            userAccountDTO.setRoles(Set.of("OWNER"));
            userAccountDTO.setContracts(Set.of(contract.getId()));
            
            userAccount = UserAccountMapper.toEntity(userAccountDTO);
            userAccount.setPasswordHash(passwordEncoder.encode(userAccountDTO.getPassword()));
        } else {
            // Cập nhật userAccount hiện có
            userAccount = existingUser.get();
            Set<Contract> contracts = userAccount.getContracts();
            if (contracts == null) {
                contracts = new HashSet<>();
            }
            contracts.add(contract);
            userAccount.setContracts(contracts);
        }
        
        // Lưu userAccount (mới hoặc cập nhật)
        userAccount = userAccountRepository.save(userAccount);
        // Cập nhật lại userAccount trong contract
        Set<UserAccount> contractUsers = contract.getUsers();
        if (contractUsers == null) {
            contractUsers = new HashSet<>();
        }
        contractUsers.add(userAccount);
        contract.setUsers(contractUsers);
        
        // Lưu contract
        contract = contractRepository.save(contract);
        
        return ContractMapper.toDto(contract);
    }

    @Override
    public ContractDTO updateContract(Long contractId, ContractDTO dto) {
        Contract existingContract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        if(dto.getOwnerId() != null) {
            HomeOwner owner = homeOwnerRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            existingContract.setOwner(owner);
        }
        existingContract.setEndDate(dto.getEndDate());
        existingContract.setStatus(dto.getStatus());
        contractRepository.save(existingContract);
        return ContractMapper.toDto(existingContract);
    }

    @Override
    public void deleteContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        List<UserAccount> userAccounts = userAccountRepository.findByContracts_Id(contract.getId());
        if (userAccounts != null) {
            userAccounts.forEach(userAccount -> {
                Set<Contract> contracts = userAccount.getContracts();
                if (contracts != null) {
                    contracts.remove(contract);
                }
                userAccountRepository.save(userAccount);
            });
        }
        contractRepository.delete(contract);
    }

    @Override
    public void requestLinkToContract(assignControlRequestDTO requestDTO) {
        Contract contract = contractRepository.findByContractCode(requestDTO.getObjectCode())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        HomeOwner owner = contract.getOwner();
        if (owner == null) {
            throw new RuntimeException("Contract does not have an owner");
        }
        // Generate OTP and send it to the owner
        // This is a placeholder for OTP generation and sending logic
        OTPDTO otp = otpService.createOtp(owner.getId());
        if (otp == null) {
            throw new RuntimeException("Failed to create OTP");
        }        
        UserAccount user = userAccountRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String message = "User " + user.getUsername() + " requested link to contract " 
            + requestDTO.getObjectCode() + ".\n"
                + "Please use the OTP code to confirm the request: " + otp.getOtpCode();
        emailService.sendEmail(owner.getEmail(), "Verify Link To Contract", message);
    }

    @Override
    public void confirmLinkToContract(assignControlConfirmDTO confirmDTO) {
        // Implementation here
        // This is a placeholder for OTP verification logic
        Contract contract = contractRepository.findByContractCode(confirmDTO.getContractCode())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        boolean confirm = otpService.verifyOtp(confirmDTO.getOtpCode(), contract.getOwner().getId());
        if (!confirm) {
            throw new RuntimeException("Invalid OTP");
        }
        UserAccount user = userAccountRepository.findById(confirmDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Contract> contracts = user.getContracts();
        if (contracts == null) {
            contracts = Set.of(contract);
        } else {
            contracts.add(contract);
        }
        user.setContracts(contracts);
        userAccountRepository.save(user);
        // Add user to contract
        Set<UserAccount> users = contract.getUsers();
        if (users == null) {
            users = Set.of(user);
        } else {
            users.add(user);
        }
        String message = "User " + user.getUsername() + " has been linked to contract " 
            + confirmDTO.getContractCode() + ".";
        emailService.sendEmail(user.getEmail(), "Link To Contract Confirmed", message);
        emailService.sendEmail(contract.getOwner().getEmail(), "Link To Contract Confirmed", message);
    }

    @Override
    public boolean isUserLinkedToContract(Long userId, String contractCode) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        //Tìm xem trong danh sách users của contract có user này không
        Contract contract = contractRepository.findByContractCode(contractCode)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        if (contract.getUsers() != null) {
            return contract.getUsers().stream()
                    .anyMatch(u -> u.getId().equals(userId));
        }
        return false;
    }
}
