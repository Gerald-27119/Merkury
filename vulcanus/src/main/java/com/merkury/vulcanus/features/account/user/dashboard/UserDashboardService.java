package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
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
    private final FavoriteSpotService favoriteSpotService;
    private final CommentsService commentsService;
    private final JwtManager jwtManager;

    public UserProfileDto getUserOwnProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return profileService.getUserOwnProfile(getCurrentUsername(request));
    }

    public ExtendedUserProfileDto getUserProfileForViewer(HttpServletRequest request, String targetUsername) throws UserNotFoundByUsernameException {
        String usernameFromCookie = null;
        if (jwtManager.getJWTFromCookie(request) != null) {
            usernameFromCookie = getCurrentUsername(request);
        }
        return profileService.getUserProfileForViewer(usernameFromCookie, targetUsername);
    }

    public List<SocialDto> getUserFriends(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(getCurrentUsername(request));
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

    public List<FavoriteSpotDto> getUserFavoritesSpots(HttpServletRequest request, FavoriteSpotsListType type) {
        return favoriteSpotService.getUserFavoritesSpots(getCurrentUsername(request), type);
    }

    public void removeFavoriteSpot(HttpServletRequest request, FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        favoriteSpotService.removeFavoriteSpot(getCurrentUsername(request), type, spotId);
    }

    public List<DatedCommentsGroupDto> getAllUserComments(HttpServletRequest request) {
        return commentsService.getAllUserComments(getCurrentUsername(request));
    }

    private String getCurrentUsername(HttpServletRequest request) {
        return jwtManager.getUsernameFromJwtCookie(request);
    }
}
