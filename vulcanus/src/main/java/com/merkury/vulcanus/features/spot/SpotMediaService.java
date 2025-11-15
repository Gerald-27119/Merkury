package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotMediaNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserIdByUsernameNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.media.IsSpotMediaLikedByUserDto;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.persistence.OptimisticLockException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

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
                    Thread.sleep(50);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    public void increaseSpotMediaViewCount(long spotMediaId) throws SpotMediaNotFoundException {
        int updated = spotMediaRepository.incrementViews(spotMediaId);
        if (updated == 0) {
            throw new SpotMediaNotFoundException(spotMediaId);
        }
    }

    public IsSpotMediaLikedByUserDto checkIsSpotMediaLikedByUser(long spotMediaId) throws UserIdByUsernameNotFoundException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        var isMediaLiked = spotMediaLikesService.checkIsSpotMediaLikedByUser(spotMediaId, username);
        return new IsSpotMediaLikedByUserDto(isMediaLiked);
    }
}
