package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.photos.DatedPhotosGroupDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.user.UserEditDataDto;
import com.merkury.vulcanus.model.enums.user.dashboard.PhotoSortType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final PhotosService photosService;
    private final SettingsService settingsService;

    public UserProfileDto getUserOwnProfile() throws UserNotFoundByUsernameException {
        return profileService.getUserOwnProfile(getCurrentUsername());
    }

    public ExtendedUserProfileDto getUserProfileForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return profileService.getUserProfileForViewer(getAuthenticatedUsernameOrNull(), targetUsername);
    }

    public List<SocialDto> getUserOwnFriends() throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(getCurrentUsername());
    }

    public List<SocialDto> getUserFriendsForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(targetUsername);
    }

    public void editUserFriends(String friendUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        friendsService.editUserFriends(getCurrentUsername(), friendUsername, type);
    }

    public void changeUserFriendsStatus(String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        friendsService.changeUserFriendsStatus(getCurrentUsername(), friendUsername, status);
    }

    public List<SocialDto> getUserOwnFollowers() throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(getCurrentUsername());
    }

    public List<SocialDto> getUserFollowersForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(targetUsername);
    }

    public List<SocialDto> getUserOwnFollowed() throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(getCurrentUsername());
    }

    public List<SocialDto> getUserFollowedForViewer(String targetUsername) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(targetUsername);
    }

    public void editUserFollowed(String followedUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        followersService.editUserFollowed(getCurrentUsername(), followedUsername, type);
    }

    public List<FavoriteSpotDto> getUserFavoritesSpots(FavoriteSpotsListType type) {
        return favoriteSpotService.getUserFavoritesSpots(getCurrentUsername(), type);
    }

    public void removeFavoriteSpot(FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        favoriteSpotService.removeFavoriteSpot(getCurrentUsername(), type, spotId);
    }

    public List<DatedPhotosGroupDto> getSortedUserPhotos(PhotoSortType type, LocalDate from, LocalDate to) throws UnsupportedPhotoSortTypeException {
        return photosService.getSortedUserPhotos(getCurrentUsername(), type, from, to);
    }

    public void editUserSettings(HttpServletResponse response, UserEditDataDto userEdit) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, EmailTakenException, SamePasswordException, SameEmailException, InvalidPasswordException, UsernameTakenException, SameUsernameException {
        settingsService.editUserSettings(response, userEdit);
    }

    private String getCurrentUsername() {
        var username = getAuthenticatedUsernameOrNull();
        if (username != null) {
            return username;
        }
        throw new IllegalStateException("No authenticated user in the security context");
    }

    private String getAuthenticatedUsernameOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            return authentication.getName();
        }
        return null;
    }
}
