package com._DPlatformer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String message;

    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public AuthResponse(String message) {
        this.message = message;
    }
}