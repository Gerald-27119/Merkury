package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.social.ExtendedSocialDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
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

    public UserProfileDto getUserOwnProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return profileService.getUserOwnProfile(getCurrentUsername(request));
    }

    public ExtendedUserProfileDto getUserProfileForViewer(HttpServletRequest request, String targetUsername) throws UserNotFoundByUsernameException {
        String usernameFromCookie = null;
        if (jwtManager.getJWTFromCookie(request) != null){
            usernameFromCookie = getCurrentUsername(request);
        }
        return profileService.getUserProfileForViewer(usernameFromCookie, targetUsername);
    }

    public List<SocialDto> getUserOwnFriends(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return friendsService.getUserOwnFriends(getCurrentUsername(request));
    }

    public List<ExtendedSocialDto> getUserFriendsForViewer(HttpServletRequest request, String targetUsername) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriendsForViewer(getCurrentUsername(request), targetUsername);
    }

    public void editUserFriends(HttpServletRequest request, String friendUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        friendsService.editUserFriends(getCurrentUsername(request), friendUsername, type);
    }

    public void changeUserFriendsStatus(HttpServletRequest request, String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        friendsService.changeUserFriendsStatus(getCurrentUsername(request), friendUsername, status);
    }

    public List<SocialDto> getUserFollowers(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(getCurrentUsername(request));
    }

    public List<SocialDto> getUserFollowed(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(getCurrentUsername(request));
    }

    public void editUserFollowed(HttpServletRequest request, String followedUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        followersService.editUserFollowed(getCurrentUsername(request), followedUsername, type);
    }

    private String getCurrentUsername(HttpServletRequest request) {
        return jwtManager.getUsernameFromJwtCookie(request);
    }
}
