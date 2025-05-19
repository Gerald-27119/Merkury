package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.mappers.ProfileMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityRepository userEntityRepository;
    private final JwtManager jwtManager;

    public UserProfileDto getUserProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var token = jwtManager.getJWTFromCookie(request);
        var username = jwtManager.getUsernameFromJWT(token);

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
