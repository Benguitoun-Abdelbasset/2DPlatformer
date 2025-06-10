package com._DPlatformer.controller;

import com._DPlatformer.model.GameProgress;
import com._DPlatformer.model.QuizQuestion;
import com._DPlatformer.repository.GameProgressService;
import com._DPlatformer.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;
    @Autowired private GameProgressService progressService;

    @GetMapping("/level/{level}")
    public List<QuizQuestion> getQuizByLevel(@PathVariable int level) {
        return quizService.getQuestionsByLevel(level);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody Map<String, String> payload, Principal principal) {
        String questionId = payload.get("questionId");
        String answer = payload.get("answer");
        String userId = principal.getName();

        boolean correct = quizService.checkAnswer(questionId, answer);
        GameProgress progress = progressService.getOrCreateProgress(userId);

        if (correct && !progress.getCompletedQuestionIds().contains(questionId)) {
            progress.getCompletedQuestionIds().add(questionId);
            if (progress.getCompletedQuestionIds().size() >= 3) {
                progress.setCurrentLevel(progress.getCurrentLevel() + 1);
                progress.getCompletedQuestionIds().clear();
            }
            progressService.updateProgress(progress);
        }

        return ResponseEntity.ok(Map.of("correct", correct, "currentLevel", progress.getCurrentLevel()));
    }

    @GetMapping("/progress")
    public GameProgress getProgress(Principal principal) {
        return progressService.getOrCreateProgress(principal.getName());
    }
}
