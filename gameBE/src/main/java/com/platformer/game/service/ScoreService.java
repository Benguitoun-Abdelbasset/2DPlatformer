package com.platformer.game.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.platformer.game.model.Score;           // Replace with your actual package
import com.platformer.game.model.User;            // Replace with your actual package
import com.platformer.game.repository.ScoreRepository; // Replace with your actual package
import com.platformer.game.repository.UserRepository;  // Replace with your actual package


@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;

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
}
