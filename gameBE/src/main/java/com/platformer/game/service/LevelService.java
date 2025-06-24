package com.platformer.game.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.platformer.game.model.Level;
import com.platformer.game.repository.LevelRepository;

import lombok.RequiredArgsConstructor;              // Replace with your actual package
@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;
    private final RestTemplate restTemplate;

    public Level generateAndSaveLevel(Map<String, Object> data) {
        String fastApiUrl = "http://fastapi-service:8000/api/level"; // FastAPI endpoint

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

