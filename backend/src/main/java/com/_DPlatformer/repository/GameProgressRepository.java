package com._DPlatformer.repository;

import com._DPlatformer.model.GameProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GameProgressRepository extends MongoRepository<GameProgress, String> {
    Optional<GameProgress> findByUserId(String userId);
}

