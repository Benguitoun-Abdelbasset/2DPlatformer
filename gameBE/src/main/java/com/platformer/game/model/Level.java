package com.platformer.game.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


import java.time.LocalDateTime;
import java.util.Map;


@Document(collection = "levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Level {
    @Id
    private String id;
    private String description;
    private Map<String, Object> leveldata;

    @Field("generated_at")
    private LocalDateTime generatedAt;
}
