package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;
    private final FriendsService friendsService;

    public UserProfileDto getUserProfile(String username) throws UserNotFoundByUsernameException {
        return profileService.getUserProfile(username);
    }

    public List<FriendDto> getUserFriends(String username) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(username);
    }
}
