package com.project.IOT.controllers;

import com.project.IOT.DTOS.HomeOwnerDTO;
import com.project.IOT.services.HomeOwnerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homeowner")
public class HomeOwnerController {

    private final HomeOwnerService homeOwnerService;

    @Autowired
    public HomeOwnerController(HomeOwnerService homeOwnerService) {
        this.homeOwnerService = homeOwnerService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<HomeOwnerDTO>> getAllHomeOwners() {
        List<HomeOwnerDTO> homeOwners = homeOwnerService.getAllHomeOwners();
        return ResponseEntity.ok(homeOwners);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<HomeOwnerDTO> getHomeOwnerById(@PathVariable Long id) {
        HomeOwnerDTO homeOwner = homeOwnerService.getHomeOwnerById(id);
        if (homeOwner == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(homeOwner);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HomeOwnerDTO> createHomeOwner(@RequestBody HomeOwnerDTO homeOwner) {
        HomeOwnerDTO savedHomeOwner = homeOwnerService.saveHomeOwner(homeOwner);
        return ResponseEntity.status(201).body(savedHomeOwner);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HomeOwnerDTO> updateHomeOwner(@PathVariable Long id, @RequestBody HomeOwnerDTO homeOwner) {
        HomeOwnerDTO existingHomeOwner = homeOwnerService.getHomeOwnerById(id);
        if (existingHomeOwner == null) {
            return ResponseEntity.status(404).body(null);
        }
        HomeOwnerDTO updatedHomeOwner = homeOwnerService.updateHomeOwner(id, homeOwner);
        if (updatedHomeOwner == null) {
            return ResponseEntity.status(400).body(null);
        }
        return ResponseEntity.ok(updatedHomeOwner);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHomeOwner(@PathVariable Long id) {
        HomeOwnerDTO homeOwner = homeOwnerService.getHomeOwnerById(id);
        if (homeOwner == null) {
            return ResponseEntity.status(404).build();
        }
        homeOwnerService.deleteHomeOwner(id);
        return ResponseEntity.noContent().build();
    }
}
    

