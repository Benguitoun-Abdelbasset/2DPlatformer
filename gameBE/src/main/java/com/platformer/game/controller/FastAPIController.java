package com.platformer.game.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/fastapi")
public class FastAPIController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_BASE_URL = "http://localhost:8000";

    @GetMapping("/test-fastapi")
    public ResponseEntity<?> testFastAPI() {
        try {
            String url = FASTAPI_BASE_URL + "/test";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to call FastAPI: " + e.getMessage()));
        }
    }

    @PostMapping("/process-via-fastapi")
    public ResponseEntity<?> processViaFastAPI(@RequestBody Map<String, Object> data) {
        try {
            String url = FASTAPI_BASE_URL + "/process";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, data, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to call FastAPI: " + e.getMessage()));
        }
    }
}
