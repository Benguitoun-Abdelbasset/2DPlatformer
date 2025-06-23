package com.platformer.game.controller;

import com.platformer.game.model.User;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.platformer.game.service.LevelService;          // Adjust to your actual package
import com.platformer.game.service.ScoreService;          // Adjust to your actual package
import com.platformer.game.repository.UserRepository;    // Adjust to your actual package
import com.platformer.game.model.Level;
import java.util.List;
import java.security.Principal;
import java.util.Optional;


@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final LevelService levelService;
    private final ScoreService scoreService;
    private final UserRepository userRepository;

    @PostMapping("/generate-level")
    public ResponseEntity<?> generateLevel(@RequestBody Map<String, Object> data) {
        System.out.println(data+"////////////////////////////////////");
        return ResponseEntity.ok(levelService.generateAndSaveLevel(data));
    }

    @PostMapping("/save-score")
    public ResponseEntity<?> saveScore(
            @RequestParam String username,
            @RequestParam double score,
            @RequestParam String levelId) {
        System.out.println("trying to save score");
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

    @GetMapping("/levels/{username}")
    public ResponseEntity<List<Level>> getUserLevels(@PathVariable String username) {
        try {
            List<Level> levels = scoreService.getLevelsByUsername(username);

            return ResponseEntity.ok(levels);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
