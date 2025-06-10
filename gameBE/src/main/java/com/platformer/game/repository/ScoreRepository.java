package com.platformer.game.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import com.platformer.game.model.Score;

public interface ScoreRepository extends MongoRepository<Score, String> {
    List<Score> findByUserId(String userId);
}
