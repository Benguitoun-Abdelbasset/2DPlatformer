package com._DPlatformer.service;


import com._DPlatformer.dto.AuthRequest;
import com._DPlatformer.exception.UserAlreadyExistsException;
import com._DPlatformer.model.AppUser;
import com._DPlatformer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AppUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(AuthRequest request){

        if (getByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username '" + request.getUsername() + "' is already taken");
        }

        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    public Optional<AppUser> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
