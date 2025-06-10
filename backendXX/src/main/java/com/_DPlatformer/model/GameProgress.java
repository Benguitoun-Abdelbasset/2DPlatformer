package com._DPlatformer.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "game_progress")
public class GameProgress {
    @Id
    private String id;
    private String userId;
    private int currentLevel;
    private List<String> completedQuestionIds;
}

