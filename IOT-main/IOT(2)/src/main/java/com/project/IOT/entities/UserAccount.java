package com.project.IOT.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Set;
import lombok.Data;

@Entity
@Table(name = "UserAccount")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") 
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private HomeOwner owner;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "UserRole",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;
}
