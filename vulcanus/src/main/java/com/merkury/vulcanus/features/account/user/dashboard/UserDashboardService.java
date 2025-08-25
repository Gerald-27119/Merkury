package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialPageDto;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotPageDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
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
    private final AddSpotService addSpotService;
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


    public SocialPageDto getUserOwnFriends(int page, int size) throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return friendsService.getUserFriends(username, page, size);
    }

    public SocialPageDto getUserFriendsForViewer(String targetUsername, int page, int size) throws UserNotFoundByUsernameException {
        return friendsService.getUserFriends(targetUsername, page, size);
    }

    public void editUserFriends(String friendUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        friendsService.editUserFriends(username, friendUsername, type);
    }

    public void changeUserFriendsStatus(String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        friendsService.changeUserFriendsStatus(username, friendUsername, status);
    }

    public SocialPageDto getUserOwnFollowers(int page, int size) throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return followersService.getUserFollowers(username, page, size);
    }

    public SocialPageDto getUserFollowersForViewer(String targetUsername, int page, int size) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowers(targetUsername, page, size);
    }

    public SocialPageDto getUserOwnFollowed(int page, int size) throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return followersService.getUserFollowed(username, page, size);
    }

    public SocialPageDto getUserFollowedForViewer(String targetUsername, int page, int size) throws UserNotFoundByUsernameException {
        return followersService.getUserFollowed(targetUsername, page, size);
    }

    public void editUserFollowed(String followedUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        followersService.editUserFollowed(username, followedUsername, type);
    }

    public FavoriteSpotPageDto getUserFavoritesSpots(FavoriteSpotsListType type, int page, int size) {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return favoriteSpotService.getUserFavoritesSpots(username, type, page, size);
    }

    public void removeFavoriteSpot(FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        favoriteSpotService.removeFavoriteSpot(username, type, spotId);
    }

    public DatedMediaGroupPageDto getSortedUserPhotos(DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return mediaService.getSortedUserPhotos(username, type, from, to, page, size);
    }

    public DatedCommentsGroupPageDto getSortedUserComments(DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return commentsService.getSortedUserComments(username, type, from, to, page, size);
    }

    public void editUserSettings(HttpServletResponse response, UserEditDataDto userEdit) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, EmailTakenException, SamePasswordException, SameEmailException, InvalidPasswordException, UsernameTakenException, SameUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        settingsService.editUserSettings(response, userEdit, username);
    }

    public UserDataDto getUserData() throws UserNotFoundByUsernameException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return settingsService.getUserData(username);
    }

    public DatedMediaGroupPageDto getSortedUserMovies(DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return mediaService.getSortedUserMovies(username, type, from, to, page, size);
    }

    public DatedMediaGroupPageDto getAllUserPhotos(String username, int page, int size) throws UnsupportedDateSortTypeException {
        return mediaService.getAllUserPhotos(username, page, size);
    }

    public AddSpotPageDto getAllSpotsAddedByUser(int page, int size) {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return addSpotService.getAllSpotsAddedByUser(username, page, size);
    }

    public void addSpot(String spotJson, List<MultipartFile> mediaFiles) throws UserNotFoundByUsernameException, IOException, InvalidFileTypeException, BlobContainerNotFoundException {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        addSpotService.addSpot(username, spotJson, mediaFiles);
    }

    public Mono<BorderPoint> getCoordinates(String query) {
        return addSpotService.getCoordinates(query);
    }
}
