package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;
    private final FriendsService friendsService;
    private final FollowersService followersService;
    private final JwtManager jwtManager;

    public UserProfileDto getUserProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        return profileService.getUserProfile(username);
    }

    public List<SocialDto> getUserFriends(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        return friendsService.getUserFriends(username);
    }

    public void editUserFriends(HttpServletRequest request, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        friendsService.editUserFriends(username, friendUsername, type);
    }

    public void changeUserFriendsStatus(HttpServletRequest request, String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        friendsService.changeUserFriendsStatus(username, friendUsername, status);
    }

    public List<SocialDto> getUserFollowers(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        return followersService.getUserFollowers(username);
    }

    public List<SocialDto> getUserFollowed(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        return followersService.getUserFollowed(username);
    }

    public void editUserFollowed(HttpServletRequest request, String followedUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        var username = jwtManager.getUsernameFromJwtCookie(request);
        followersService.editUserFollowed(username, followedUsername, type);
    }
}
