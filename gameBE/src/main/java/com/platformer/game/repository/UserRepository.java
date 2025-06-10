package com.platformer.game.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.platformer.game.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
