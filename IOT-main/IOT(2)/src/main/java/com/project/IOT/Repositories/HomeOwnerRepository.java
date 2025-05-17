package com.project.IOT.Repositories;

import com.project.IOT.Entities.HomeOwner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HomeOwnerRepository extends JpaRepository<HomeOwner, Long> {
    Optional<HomeOwner> findByEmail(String email);
}
