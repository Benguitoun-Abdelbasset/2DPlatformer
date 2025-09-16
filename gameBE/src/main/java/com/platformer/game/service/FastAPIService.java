package com.platformer.game.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class FastAPIService {

    private final WebClient webClient;
    private final String FASTAPI_BASE_URL = "http://localhost:8000";

    public FastAPIService() {
        this.webClient = WebClient.builder()
                .baseUrl(FASTAPI_BASE_URL)
                .build();
    }

    public Map<String, Object> callFastAPITest() {
        return webClient.get()
                .uri("/test")
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
