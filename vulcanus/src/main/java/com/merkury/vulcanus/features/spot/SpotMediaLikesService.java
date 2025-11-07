package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotMediaNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class SpotMediaLikesService {
    private final SpotMediaRepository spotMediaRepository;
    private final UserEntityRepository userEntityRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void toggleLikes(String username, long spotMediaId) throws SpotMediaNotFoundException, UserNotFoundByUsernameException {
        var user = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
        var spotMedia = spotMediaRepository.findById(spotMediaId)
                .orElseThrow(() -> new SpotMediaNotFoundException(spotMediaId));

        boolean alreadyLiked = user.getLikedSpotMedia().contains(spotMedia);
        if (alreadyLiked) {
            user.getLikedSpotMedia().remove(spotMedia);
            spotMedia.setLikes(spotMedia.getLikes() - 1);
        } else {
            user.getLikedSpotMedia().add(spotMedia);
            spotMedia.setLikes(spotMedia.getLikes() + 1);
        }

        userEntityRepository.save(user);
        spotMediaRepository.save(spotMedia);
    }
}
