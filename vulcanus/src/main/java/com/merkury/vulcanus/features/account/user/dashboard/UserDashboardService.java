package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;
    private final JwtManager jwtManager;

    public UserProfileDto getUserProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var token = jwtManager.getJWTFromCookie(request);
        var username = jwtManager.getUsernameFromJWT(token);

        return profileService.getUserProfile(username);
    }
}
