package com._DPlatformer.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "quiz_questions")
public class QuizQuestion {
    @Id
    private String id;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private int level;
    private String topic;
}

