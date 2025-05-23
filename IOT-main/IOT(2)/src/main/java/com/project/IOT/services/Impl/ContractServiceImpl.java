package com.project.IOT.services.Impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
    public ContractDTO getContractsByUser(Long userId) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Contract> contracts = userAccount.getContracts();
        return contracts.stream().map(ContractMapper::toDto).findFirst()
                .orElseThrow(() -> new RuntimeException("No contract found for user"));
    }

    @Override
    public ContractDTO createContract(ContractDTO dto) {
        HomeOwner owner = homeOwnerRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Contract contract = ContractMapper.toEntity(dto, owner);
        contract = contractRepository.save(contract);
        Optional<UserAccount> existingUser = userAccountRepository.findByEmail(owner.getEmail());
        if (!existingUser.isPresent()) {
            //Tạo userAccount cho homeOwner
            UserAccountDTO userAccountDTO = new UserAccountDTO();
            userAccountDTO.setUsername(owner.getEmail());
            userAccountDTO.setPassword("defaultPassword");
            userAccountDTO.setEmail(owner.getEmail());
            userAccountDTO.setRoles(Set.of("OWNER"));
            userAccountDTO.setContracts(Set.of(contract.getId()));
            UserAccount userAccount = UserAccountMapper.toEntity(userAccountDTO);
            userAccount.setPasswordHash(passwordEncoder.encode(userAccountDTO.getPassword()));
            userAccountRepository.save(userAccount);
        } else {
            // Nếu đã tồn tại userAccount, thêm contract vào danh sách contracts
            Set<Contract> contracts = existingUser.get().getContracts();
            if (contracts == null) {
                contracts = Set.of(contract);
            } else {
                contracts.add(contract);
            }
            existingUser.get().setContracts(contracts);
            userAccountRepository.save(existingUser.get());
        }
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
        // Implementation here
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
        String message = "User " + user.getUsername() + " has been linked to contract " 
            + confirmDTO.getContractCode() + ".";
        emailService.sendEmail(user.getEmail(), "Link To Contract Confirmed", message);
        emailService.sendEmail(contract.getOwner().getEmail(), "Link To Contract Confirmed", message);
    }

    @Override
    public boolean isUserLinkedToContract(Long userId, String contractCode) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Contract> contracts = user.getContracts();
        if (contracts == null || contracts.isEmpty()) {
            return false;
        }
        for (Contract contract : contracts) {
            if (contract.getContractCode().equals(contractCode)) {
                return true;
            }
        }
        return false;
    }
}
