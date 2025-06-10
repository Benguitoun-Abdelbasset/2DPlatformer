package com._DPlatformer.repository;

import com._DPlatformer.model.GameProgress;
import com._DPlatformer.model.QuizQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface QuizQuestionRepository extends MongoRepository<QuizQuestion, String> {
    List<QuizQuestion> findByLevel(int level);
}

