package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.mappers.ProfileMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityRepository userEntityRepository;

    public UserProfileDto getUserProfile(String username) throws UserNotFoundByUsernameException {
        var user = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
        var images = user.getImages().stream()
                .sorted(Comparator.comparingInt(Img::getLikes).reversed())
                .limit(4)
                .map(ProfileMapper::toDto)
                .toList();
        return ProfileMapper.toDto(user, images);
    }
}
