package com._DPlatformer.service;

import com._DPlatformer.model.QuizQuestion;
import com._DPlatformer.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizQuestionRepository quizRepo;

    public List<QuizQuestion> getQuestionsByLevel(int level) {
        return quizRepo.findByLevel(level);
    }

    public boolean checkAnswer(String questionId, String answer) {
        return quizRepo.findById(questionId)
                .map(q -> q.getCorrectAnswer().equalsIgnoreCase(answer))
                .orElse(false);
    }
}

