package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;

    public UserProfileDto getUserProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return profileService.getUserProfile(request);
    }
}
