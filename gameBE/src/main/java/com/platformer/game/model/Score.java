package com.platformer.game.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    @Id
    private String id;
    private double score;

    @Field("userid")
    private String userId;

    @Field("leveled")
    private String levelId;

    private LocalDateTime date;
}
