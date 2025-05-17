package com.project.IOT.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "HomeOwner")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeOwner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "owner_id")
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;
}
