package com.platformer.game.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.platformer.game.model.Score;
import com.platformer.game.model.User;
import com.platformer.game.model.Level;
import com.platformer.game.repository.ScoreRepository;
import com.platformer.game.repository.UserRepository;
import com.platformer.game.repository.LevelRepository;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;
    private final LevelRepository levelRepository;

    public Score saveScore(String username, double score, String levelId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Score s = new Score();
        s.setScore(score);
        s.setUserId(user.getId());
        s.setLevelId(levelId);
        s.setDate(LocalDateTime.now());

        return scoreRepository.save(s);
    }

    public List<Score> getScoresByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return scoreRepository.findByUserId(user.getId());
    }

    public List<Level> getLevelsByUsername(String username) {
        // 1. Get all scores for the user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Score> scores = scoreRepository.findByUserId(user.getId());

        // 2. Extract distinct level IDs
        Set<String> levelIds = scores.stream()
                .map(Score::getLevelId)  // Make sure your Score model has getLevelId()
                .collect(Collectors.toSet());
        // 3. Find all levels by those IDs
        return levelRepository.findAllById(levelIds);
    }
}
