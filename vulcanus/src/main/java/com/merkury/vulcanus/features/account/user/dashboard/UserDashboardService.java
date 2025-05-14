package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;
    private final FriendsService friendsService;
    private final FollowersService followersService;

    public UserProfileDto getUserProfile(String username) throws UserNotFoundByUsernameException {
        return profileService.getUserProfile(username);
    }

    public List<FriendDto> getUserFriends(String username) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(username);
    }

    public void editUserFriends(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException {
        friendsService.editUserFriends(username, friendUsername, type);
    }

    public void changeUserFriendsStatus(String username, String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        friendsService.changeUserFriendsStatus(username, friendUsername, status);
    }

    public List<FriendDto> getUserFollowers(String username) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(username);
    }

    public List<FriendDto> getUserFollowed(String username) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(username);
    }

    public void editUserFollowed(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FollowedAlreadyExistException, FollowedNotExistException {
        followersService.editUserFollowed(username, friendUsername, type);
    }
}
