package com.project.IOT.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "data")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mqtt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_topic", nullable = false)
    private Topic topic;

    @Column(nullable = false)
    private String value;
}
