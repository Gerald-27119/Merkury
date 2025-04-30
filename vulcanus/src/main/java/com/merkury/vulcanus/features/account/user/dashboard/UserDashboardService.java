package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;

    public UserProfileDto getUserProfile(String username) throws UserNotFoundByUsernameException {
        return profileService.getUserProfile(username);
    }
}
