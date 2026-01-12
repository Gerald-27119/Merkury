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
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class SpotMediaService {

    private final SpotMediaRepository spotMediaRepository;
    private final SpotMediaLikesService spotMediaLikesService;
    private final CustomUserDetailsService customUserDetailsService;

    @Retryable(retryFor = {ObjectOptimisticLockingFailureException.class, OptimisticLockException.class},
            maxAttempts = 5,
            backoff = @Backoff(delay = 50, multiplier = 2.0, maxDelay = 2000))
    public void toggleSpotMediaLikes(long spotMediaId) throws SpotMediaNotFoundException, UserNotFoundByUsernameException {
        String username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        spotMediaLikesService.toggleLikes(username, spotMediaId);
    }

    @Recover
    public void recoverFromToggleSpotMediaLikes(Exception e, long spotMediaId) {
        log.error("Could not toggle likes for media {} after retries", spotMediaId, e);
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
