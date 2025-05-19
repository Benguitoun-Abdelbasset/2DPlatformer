package com._DPlatformer.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/summarize")
public class SummarizationController {

    @Value("${fastapi.url}")
    private String fastApiBaseUrl;

    private final RestTemplate restTemplate;

    public SummarizationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> summarizeText(@RequestBody SummarizeRequest request) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Prepare request body matching FastAPI's TextIn model
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", request.getText());

            // Create the HTTP entity with headers and body
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Call the FastAPI endpoint with POST and proper JSON body
            String apiUrl = fastApiBaseUrl + "/summarize";
            Map<String, String> summary = restTemplate.postForObject(
                    apiUrl,
                    entity,
                    Map.class
            );

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error summarizing text: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Request model class
    public static class SummarizeRequest {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}