package com._DPlatformer.repository;

import com._DPlatformer.model.GameProgress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class GameProgressService {
    @Autowired
    private GameProgressRepository progressRepo;

    public GameProgress getOrCreateProgress(String userId) {
        return progressRepo.findByUserId(userId)
                .orElseGet(() -> {
                    GameProgress progress = new GameProgress();
                    progress.setUserId(userId);
                    progress.setCurrentLevel(1);
                    progress.setCompletedQuestionIds(new ArrayList<>());
                    return progressRepo.save(progress);
                });
    }

    public void updateProgress(GameProgress progress) {
        progressRepo.save(progress);
    }
}
