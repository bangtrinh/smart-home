package com.project.IOT.DTOS;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicDTO {
    private Long id;
    private String name;
    private String path;
    private String latest_data;
}
