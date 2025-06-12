package com.platformer.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {


    private boolean success;
    private String username;
    private String message;

}