package com.platformer.game.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class FastAPIService {

    private final WebClient webClient;
    private final String FASTAPI_BASE_URL = "http://fastapi-service:8000";

    public FastAPIService() {
        this.webClient = WebClient.builder()
                .baseUrl(FASTAPI_BASE_URL)
                .build();
    }

    public Map<String, Object> callFastAPITest() {
        return webClient.get()
                .uri("/api/level")
                .retrieve()
                .bodyToMono(Map.class)
                .block(); // Use .subscribe() for reactive approach
    }

    public Map<String, Object> sendDataToFastAPI(Map<String, Object> data) {
        return webClient.post()
                .uri("/process")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
