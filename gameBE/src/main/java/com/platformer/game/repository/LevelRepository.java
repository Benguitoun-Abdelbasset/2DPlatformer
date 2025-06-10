package com.platformer.game.repository;

import com.platformer.game.model.Level;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LevelRepository extends MongoRepository<Level, String> {
}