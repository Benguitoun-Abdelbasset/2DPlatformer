package com.platformer.game.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platformer.game.service.LevelService;          // Adjust to your actual package
import com.platformer.game.service.ScoreService;          // Adjust to your actual package
import com.platformer.game.repository.UserRepository;    // Adjust to your actual package


@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final LevelService levelService;
    private final ScoreService scoreService;
    private final UserRepository userRepository;

    @PostMapping("/generate-level")
    public ResponseEntity<?> generateLevel(@RequestParam String difficulty) {
        return ResponseEntity.ok(levelService.generateAndSaveLevel(difficulty));
    }

    @PostMapping("/save-score")
    public ResponseEntity<?> saveScore(
            @RequestParam String username,
            @RequestParam double score,
            @RequestParam String levelId) {
        return ResponseEntity.ok(scoreService.saveScore(username, score, levelId));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserData(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user-scores/{username}")
    public ResponseEntity<?> getUserScores(@PathVariable String username) {
        return ResponseEntity.ok(scoreService.getScoresByUsername(username));
    }

    @GetMapping("/level/{id}")
    public ResponseEntity<?> getLevel(@PathVariable String id) {
        return levelService.getLevelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
