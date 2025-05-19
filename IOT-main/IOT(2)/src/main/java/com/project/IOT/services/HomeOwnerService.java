package com.project.IOT.services;

import com.project.IOT.DTOS.HomeOwnerDTO;
import java.util.List;

public interface HomeOwnerService {

    List<HomeOwnerDTO> getAllHomeOwners();

    HomeOwnerDTO getHomeOwnerById(Long id);

    HomeOwnerDTO saveHomeOwner(HomeOwnerDTO homeOwner);

    HomeOwnerDTO updateHomeOwner(Long id, HomeOwnerDTO homeOwner);

    void deleteHomeOwner(Long id);
}