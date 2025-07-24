package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final ProfileService profileService;
    private final FriendsService friendsService;
    private final FollowersService followersService;
    private final FavoriteSpotService favoriteSpotService;
    private final MediaService mediaService;
    private final CommentsService commentsService;
    private final SettingsService settingsService;
    private final CustomUserDetailsService customUserDetailsService;

    public UserProfileDto getUserOwnProfile() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return profileService.getUserOwnProfile(username);
    }

    public ExtendedUserProfileDto getUserProfileForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        String viewerUsername = null;

        try {
            viewerUsername = customUserDetailsService
                    .loadUserDetailsFromSecurityContext()
                    .getUsername();
        } catch (AuthenticationCredentialsNotFoundException | InsufficientAuthenticationException ignored) {
            // User is not authenticated — viewerUsername remains null
        }

        return profileService.getUserProfileForViewer(viewerUsername, targetUsername);
    }


    public List<SocialDto> getUserOwnFriends() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return friendsService.getUserFriends(username);
    }

    public List<SocialDto> getUserFriendsForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(targetUsername);
    }

    public void editUserFriends(String friendUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        friendsService.editUserFriends(username, friendUsername, type);
    }

    public void changeUserFriendsStatus(String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        friendsService.changeUserFriendsStatus(username, friendUsername, status);
    }

    public List<SocialDto> getUserOwnFollowers() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return followersService.getUserFollowers(username);
    }

    public List<SocialDto> getUserFollowersForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(targetUsername);
    }

    public List<SocialDto> getUserOwnFollowed() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return followersService.getUserFollowed(username);
    }

    public List<SocialDto> getUserFollowedForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(targetUsername);
    }

    public void editUserFollowed(String followedUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        followersService.editUserFollowed(username, followedUsername, type);
    }

    public List<FavoriteSpotDto> getUserFavoritesSpots(FavoriteSpotsListType type) {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return favoriteSpotService.getUserFavoritesSpots(username, type);
    }

    public void removeFavoriteSpot(FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        favoriteSpotService.removeFavoriteSpot(username, type, spotId);
    }

    public List<DatedMediaGroupDto> getSortedUserPhotos(DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return mediaService.getSortedUserPhotos(username, type, from, to);
    }

    public List<DatedCommentsGroupDto> getSortedUserComments(DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return commentsService.getSortedUserComments(username, type, from, to);
    }

    public void editUserSettings(HttpServletResponse response, UserEditDataDto userEdit) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, EmailTakenException, SamePasswordException, SameEmailException, InvalidPasswordException, UsernameTakenException, SameUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        settingsService.editUserSettings(response, userEdit, username);
    }

    public UserDataDto getUserData() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return settingsService.getUserData(username);
    }

    public List<DatedMediaGroupDto> getSortedUserMovies(DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return mediaService.getSortedUserMovies(username, type, from, to);
    }
}
