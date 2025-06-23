package com.platformer.game.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import com.platformer.game.model.Level;              // Replace with your actual package
import com.platformer.game.repository.LevelRepository; // Replace with your actual package
import com.platformer.game.model.Score;
import java.util.List;
@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;
    private final RestTemplate restTemplate;

    public Level generateAndSaveLevel(Map<String, Object> data) {
        String fastApiUrl = "http://localhost:8000/api/level"; // FastAPI endpoint

        try {
            // Send POST request directly to FastAPI
            ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, data, Map.class);
            Map<String, Object> responseData = response.getBody();
            if (responseData == null) {
                throw new RuntimeException("FastAPI response is null");
            }

            // Create Level entity from FastAPI response
            Level level = new Level();
            level.setDescription((String) responseData.get("description"));
            level.setLeveldata((Map<String, Object>) responseData);
            level.setGeneratedAt(LocalDateTime.now());

            return levelRepository.save(level);
        } catch (Exception e) {
            System.out.println("Error calling FastAPI: " + e.getMessage());
            return null;
        }
    }


    public Optional<Level> getLevelById(String id) {
        return levelRepository.findById(id);
    }
}

