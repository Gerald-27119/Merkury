package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialPageDto;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.spots.IsFavouriteSpotDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.FavouriteSpotListOperationType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserDashboardController {
    private final UserDashboardService userDashboardService;

    @GetMapping("/user-dashboard/profile")
    public ResponseEntity<UserProfileDto> getUserOwnProfile() throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnProfile());
    }

    @GetMapping("/public/user-dashboard/profile/{targetUsername}")
    public ResponseEntity<ExtendedUserProfileDto> getUserProfileForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserProfileForViewer(targetUsername));
    }

    @PatchMapping("/user-dashboard/profile")
    public ResponseEntity<Void> changeUserProfilePhoto(@RequestPart MultipartFile profilePhoto) throws InvalidFileTypeException, UserNotFoundByUsernameException, BlobContainerNotFoundException, IOException, URISyntaxException {
        userDashboardService.changeUserProfilePhoto(profilePhoto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/friends")
    public ResponseEntity<SocialPageDto> getUserOwnFriends(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFriends(page, size));
    }

    @GetMapping("/public/user-dashboard/friends/{targetUsername}")
    public ResponseEntity<SocialPageDto> getUserFriendsForViewer(@PathVariable String targetUsername,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriendsForViewer(targetUsername, page, size));
    }

    @PatchMapping("/user-dashboard/friends")
    public ResponseEntity<Void> editUserFriends(@RequestParam String friendUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFriends(friendUsername, type);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/user-dashboard/friends/change-status")
    public ResponseEntity<Void> changeUserFriendsStatus(@RequestParam String friendUsername, @RequestParam UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException, UnsupportedUserFriendStatusException {
        userDashboardService.changeUserFriendsStatus(friendUsername, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/followers")
    public ResponseEntity<SocialPageDto> getUserOwnFollowers(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowers(page, size));
    }

    @GetMapping("/public/user-dashboard/followers/{targetUsername}")
    public ResponseEntity<SocialPageDto> getUserFollowersForViewer(@PathVariable String targetUsername,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowersForViewer(targetUsername, page, size));
    }

    @GetMapping("/user-dashboard/followed")
    public ResponseEntity<SocialPageDto> getUserOwnFollowed(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowed(page, size));
    }

    @GetMapping("/public/user-dashboard/followed/{targetUsername}")
    public ResponseEntity<SocialPageDto> getUserFollowedForViewer(@PathVariable String targetUsername,
                                                                  @RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowedForViewer(targetUsername, page, size));
    }

    @GetMapping("/user-dashboard/friends/find")
    public ResponseEntity<SocialPageDto> searchUsersByUsername(@RequestParam String query,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.searchUsersByUsername(query, page, size));
    }

    @GetMapping("/user-dashboard/friends/invites")
    public ResponseEntity<SocialPageDto> getAllFriendInvites(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getAllFriendInvites(page, size));
    }

    @PatchMapping("/user-dashboard/followed")
    public ResponseEntity<Void> editUserFollowed(@RequestParam String followedUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFollowed(followedUsername, type);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<FavoriteSpotPageDto> getAllUserFavoritesSpots(@RequestParam FavoriteSpotsListType type,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userDashboardService.getUserFavoritesSpots(type, page, size));
    }

    @PatchMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<Void> editFavoriteSpotList(@RequestParam FavoriteSpotsListType type, @RequestParam Long spotId, @RequestParam FavouriteSpotListOperationType operationType) throws FavoriteSpotNotExistException, UserNotFoundException, SpotNotFoundException, SpotAlreadyFavouriteException {
        userDashboardService.editFavoriteSpotList(type, spotId, operationType);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user-dashboard/add-spot-media")
    public ResponseEntity<Void> addMediaToSpot(@RequestPart("media") List<MultipartFile> mediaFiles, @RequestParam Long spotId) throws InvalidFileTypeException, SpotNotFoundException, UserNotFoundByUsernameException, BlobContainerNotFoundException, IOException {
        userDashboardService.addMediaToSpot(mediaFiles, spotId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/is-spot-favourite")
    public ResponseEntity<IsFavouriteSpotDto> isSpotFavourite(@RequestParam Long spotId) {
        return ResponseEntity.ok(userDashboardService.isSpotInUserFavoriteSpots(spotId));

    }

    @GetMapping("/user-dashboard/photos")
    public ResponseEntity<DatedMediaGroupPageDto> getSortedUserPhotos(@RequestParam DateSortType type,
                                                                      @RequestParam(required = false) LocalDate from,
                                                                      @RequestParam(required = false) LocalDate to,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "20") int size) throws UnsupportedDateSortTypeException {
        return ResponseEntity.ok(userDashboardService.getSortedUserPhotos(type, from, to, page, size));
    }

    @GetMapping("user-dashboard/comments")
    public ResponseEntity<DatedCommentsGroupPageDto> getSortedUserComments(@RequestParam DateSortType type,
                                                                           @RequestParam(required = false) LocalDate from,
                                                                           @RequestParam(required = false) LocalDate to,
                                                                           @RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "20") int size) throws UnsupportedDateSortTypeException {
        return ResponseEntity.ok(userDashboardService.getSortedUserComments(type, from, to, page, size));
    }

    @PatchMapping("/user-dashboard/settings")
    public ResponseEntity<Void> editUserSettings(HttpServletResponse response, @Valid @RequestBody UserEditDataDto userEdit) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, EmailTakenException, SamePasswordException, SameEmailException, InvalidPasswordException, UsernameTakenException, SameUsernameException {
        userDashboardService.editUserSettings(response, userEdit);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/settings")
    public ResponseEntity<UserDataDto> getUserData() throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserData());
    }

    @GetMapping("/user-dashboard/movies")
    public ResponseEntity<DatedMediaGroupPageDto> getSortedUserMovies(@RequestParam DateSortType type,
                                                                      @RequestParam(required = false) LocalDate from,
                                                                      @RequestParam(required = false) LocalDate to,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "20") int size) throws UnsupportedDateSortTypeException {
        return ResponseEntity.ok(userDashboardService.getSortedUserMovies(type, from, to, page, size));
    }

    @GetMapping("/user-dashboard/photos/{targetUsername}")
    public ResponseEntity<DatedMediaGroupPageDto> getAllUserPhotos(@PathVariable String targetUsername,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "20") int size) throws UnsupportedDateSortTypeException {
        return ResponseEntity.ok(userDashboardService.getAllUserPhotos(targetUsername, page, size));
    }

    @GetMapping("/user-dashboard/add-spot")
    public ResponseEntity<AddSpotPageDto> getAllSpotsAddedByUser(@RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userDashboardService.getAllSpotsAddedByUser(page, size));
    }

    @PostMapping("/user-dashboard/add-spot")
    public ResponseEntity<Void> addSpot(@RequestPart("spot") String spotJson,
                                        @RequestPart("media") List<MultipartFile> mediaFiles) throws InvalidFileTypeException, UserNotFoundByUsernameException, BlobContainerNotFoundException, IOException {
        userDashboardService.addSpot(spotJson, mediaFiles);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/add-spot/coordinates")
    public ResponseEntity<Mono<BorderPoint>> getCoordinates(@RequestParam String query) {
        return ResponseEntity.ok(userDashboardService.getCoordinates(query));
    }
}
