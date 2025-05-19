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
        Contract contract = userAccount.getContract();
        ContractDTO contractDTO = ContractMapper.toDto(contract);
        return contractDTO;
    }

    @Override
    public ContractDTO createContract(ContractDTO dto) {
        HomeOwner owner = homeOwnerRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Contract contract = ContractMapper.toEntity(dto, owner);
        contract = contractRepository.save(contract);

        //Tạo userAccount cho homeOwner
        UserAccountDTO userAccountDTO = new UserAccountDTO();
        userAccountDTO.setUsername(owner.getEmail());
        userAccountDTO.setPassword("defaultPassword");
        userAccountDTO.setEmail(owner.getEmail());
        userAccountDTO.setRoles(Set.of("OWNER"));
        userAccountDTO.setContractId(contract.getId());

        UserAccount userAccount = UserAccountMapper.toEntity(userAccountDTO);
        userAccount.setPasswordHash(passwordEncoder.encode(userAccountDTO.getPassword()));
        userAccountRepository.save(userAccount);
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
        HomeOwner owner = homeOwnerRepository.findByEmail(confirmDTO.getHomeOwnerEmail())
                .orElseThrow(() -> new RuntimeException("HomeOwner not found"));
        boolean confirm = otpService.verifyOtp(confirmDTO.getOtpCode(), owner.getId());
        if (!confirm) {
            throw new RuntimeException("Invalid OTP");
        }
        UserAccount user = userAccountRepository.findById(confirmDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Contract contract = contractRepository.findByContractCode(confirmDTO.getObjectCode())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        user.setContract(contract);
        userAccountRepository.save(user);
        String message = "User " + user.getUsername() + " has been linked to contract " 
            + confirmDTO.getObjectCode() + ".";
        emailService.sendEmail(user.getEmail(), "Link To Contract Confirmed", message);
        emailService.sendEmail(owner.getEmail(), "Link To Contract Confirmed", message);
    }
}
