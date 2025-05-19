package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.HomeOwnerDTO;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Mapper.HomeOwnerMapper;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.services.HomeOwnerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeOwnerServiceImpl implements HomeOwnerService {

    private final HomeOwnerRepository homeOwnerRepository;

    @Autowired
    public HomeOwnerServiceImpl(HomeOwnerRepository homeOwnerRepository) {
        this.homeOwnerRepository = homeOwnerRepository;
    }

    @Override
    public List<HomeOwnerDTO> getAllHomeOwners() {
        List<HomeOwner> homeOwners = homeOwnerRepository.findAll();
        List<HomeOwnerDTO> homeOwnerDTOs = new ArrayList<>();
        for (HomeOwner homeOwner : homeOwners) {
            HomeOwnerDTO dto = HomeOwnerMapper.toDto(homeOwner);
            homeOwnerDTOs.add(dto);
        }
        return homeOwnerDTOs;
    }

    @Override
    public HomeOwnerDTO getHomeOwnerById(Long id) {
        HomeOwner homeOwner = homeOwnerRepository.findById(id).orElse(null);
        return HomeOwnerMapper.toDto(homeOwner);
    }

    @Override
    public HomeOwnerDTO saveHomeOwner(HomeOwnerDTO homeOwnerDTO) {
        HomeOwner entity = new HomeOwner();
        entity.setFullName(homeOwnerDTO.getFullName());
        entity.setPhone(homeOwnerDTO.getPhone());
        entity.setEmail(homeOwnerDTO.getEmail());
        entity.setAddress(homeOwnerDTO.getAddress());
        // Map other fields as necessary
        return HomeOwnerMapper.toDto(homeOwnerRepository.save(entity));
    }

    @Override
    public HomeOwnerDTO updateHomeOwner(Long id, HomeOwnerDTO homeOwnerDTO) {
        HomeOwner existingHomeOwner = homeOwnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HomeOwner not found"));
        existingHomeOwner.setFullName(homeOwnerDTO.getFullName());
        existingHomeOwner.setPhone(homeOwnerDTO.getPhone());
        existingHomeOwner.setEmail(homeOwnerDTO.getEmail());
        existingHomeOwner.setAddress(homeOwnerDTO.getAddress());
        // Map other fields as necessary
        return HomeOwnerMapper.toDto(homeOwnerRepository.save(existingHomeOwner));
    }

    @Override
    public void deleteHomeOwner(Long id) {
        if (!homeOwnerRepository.existsById(id)) {
            throw new RuntimeException("HomeOwner not found");
        }
        homeOwnerRepository.deleteById(id);
    }
}