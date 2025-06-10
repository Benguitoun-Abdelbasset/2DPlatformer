package com.platformer.game.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import com.platformer.game.model.Level;              // Replace with your actual package
import com.platformer.game.repository.LevelRepository; // Replace with your actual package

@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;
    private final RestTemplate restTemplate;

    public Level generateAndSaveLevel(String difficulty) {
        String flaskUrl = "http://localhost:5000/generate?difficulty=" + difficulty;
        Map<String, Object> flaskResponse = restTemplate.getForObject(flaskUrl, Map.class);

        Level level = new Level();
        level.setDescription((String) flaskResponse.get("description"));
        level.setLeveldata((Map<String, Object>) flaskResponse.get("leveldata"));
        level.setGeneratedAt(LocalDateTime.now());

        return levelRepository.save(level);
    }

    public Optional<Level> getLevelById(String id) {
        return levelRepository.findById(id);
    }
}