package com.project.IOT.Entities;

import jakarta.persistence.*;
import lombok.*;

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
