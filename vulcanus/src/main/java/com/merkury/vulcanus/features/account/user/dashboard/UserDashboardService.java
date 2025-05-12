package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FollowedConnectionAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
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

    public void editUserFriends(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExist {
        friendsService.editUserFriends(username, friendUsername, type);
    }

    public List<FriendDto> getUserFollowers(String username) throws UserNotFoundByUsernameException {
        return friendsService.getUserFollowers(username);
    }

    public List<FriendDto> getUserFollowed(String username) throws UserNotFoundByUsernameException {
        return friendsService.getUserFollowed(username);
    }

    public void editUserFollowed(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FollowedConnectionAlreadyExist {
        friendsService.editUserFollowed(username, friendUsername, type);
    }
}
