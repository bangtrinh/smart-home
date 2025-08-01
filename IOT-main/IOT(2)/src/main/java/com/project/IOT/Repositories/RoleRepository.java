package com.project.IOT.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.IOT.Entities.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String roleName);
}
