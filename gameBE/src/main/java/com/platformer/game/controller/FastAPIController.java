package com.platformer.game.controller;


import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
@RestController
@RequestMapping("/fastapi")
public class FastAPIController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_BASE_URL = "http://fastapi-service:8000";

    // Optional GET test
    @GetMapping("/test-fastapi")
    public ResponseEntity<?> testFastAPI() {
        try {
            String url = FASTAPI_BASE_URL + "/api/level";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to call FastAPI: " + e.getMessage()));
        }
    }

    // This POST forwards a JSON payload to FastAPI and returns FastAPI's JSON response
    @PostMapping("/process-via-fastapi")
    public ResponseEntity<?> processViaFastAPI(@RequestBody Map<String, Object> data) {
        try {
            String url = FASTAPI_BASE_URL + "/api/level";  // FastAPI endpoint
            System.out.println("Spring ← Received from Angular: " + data);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, data, Map.class);
            System.out.println("Spring ← Received from FastApi: " + response);
            return ResponseEntity.ok(response.getBody());  // Return FastAPI's JSON response
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to call FastAPI: " + e.getMessage()));
        }
    }
}

