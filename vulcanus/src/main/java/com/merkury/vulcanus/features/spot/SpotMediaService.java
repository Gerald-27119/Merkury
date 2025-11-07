package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotMediaNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.persistence.OptimisticLockException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpotMediaService {

    private final SpotMediaRepository spotMediaRepository;
    private final SpotMediaLikesService spotMediaLikesService;
    private final CustomUserDetailsService customUserDetailsService;

    private static final int MAX_RETRIES = 3;

    public void toggleSpotMediaLikes(long spotMediaId) throws SpotMediaNotFoundException, UserNotFoundByUsernameException {
        String username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();

        int attempts = 0;
        while (true) {
            attempts++;
            try {
                spotMediaLikesService.toggleLikes(username, spotMediaId);
                break;
            } catch (ObjectOptimisticLockingFailureException | OptimisticLockException e) {
                if (attempts >= MAX_RETRIES) {
                    log.error("Failed to save spot media likes change. Max retries count exceeded.", e);
                    throw e;
                }
                try {
                    wait(50);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    @Transactional
    public void increaseSpotMediaViewCount(long spotMediaId) throws SpotMediaNotFoundException {
        var spotMedia = spotMediaRepository.findById(spotMediaId).orElseThrow(() -> new SpotMediaNotFoundException(spotMediaId));
        spotMedia.setViews(spotMedia.getViews() + 1);
        spotMediaRepository.save(spotMedia);
    }
}
