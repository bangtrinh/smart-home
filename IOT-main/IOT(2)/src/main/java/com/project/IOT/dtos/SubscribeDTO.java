package com.project.IOT.DTOS;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscribeDTO {
    private Long id;
    private Long userId;
    private Long topicId;
}
