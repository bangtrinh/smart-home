package com.project.IOT.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscribe")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscribe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "topic_id", unique = true, nullable = false)
    private Topic topic;
}
