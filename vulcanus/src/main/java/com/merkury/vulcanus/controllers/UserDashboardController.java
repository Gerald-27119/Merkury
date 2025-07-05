package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.photos.DatedPhotosGroupDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.PhotoSortType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user-dashboard/friends")
    public ResponseEntity<List<SocialDto>> getUserOwnFriends() throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFriends());
    }

    @GetMapping("/public/user-dashboard/friends/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFriendsForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriendsForViewer(targetUsername));
    }

    @PatchMapping("/user-dashboard/friends")
    public ResponseEntity<Void> editUserFriends(@RequestParam String friendUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFriends(friendUsername, type);
        return ResponseEntity.ok().build();
    }

    /// TODO na frontendzie na razie nie jest to obsłużone będzie to zrobione w innym zadaniu
    @PatchMapping("/user-dashboard/friends/change-status")
    public ResponseEntity<Void> changeUserFriendsStatus(@RequestParam String friendUsername, @RequestParam UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        userDashboardService.changeUserFriendsStatus(friendUsername, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/followers")
    public ResponseEntity<List<SocialDto>> getUserOwnFollowers() throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowers());
    }

    @GetMapping("/public/user-dashboard/followers/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFollowersForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowersForViewer(targetUsername));
    }

    @GetMapping("/user-dashboard/followed")
    public ResponseEntity<List<SocialDto>> getUserOwnFollowed() throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowed());
    }

    @GetMapping("/public/user-dashboard/followed/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFollowedForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowedForViewer(targetUsername));
    }

    @PatchMapping("/user-dashboard/followed")
    public ResponseEntity<Void> editUserFollowed(@RequestParam String followedUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFollowed(followedUsername, type);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<List<FavoriteSpotDto>> getAllUserFavoritesSpots(@RequestParam FavoriteSpotsListType type) {
        return ResponseEntity.ok(userDashboardService.getUserFavoritesSpots(type));
    }

    @PatchMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<Void> removeFavoriteSpot(@RequestParam FavoriteSpotsListType type, @RequestParam Long spotId) throws FavoriteSpotNotExistException {
        userDashboardService.removeFavoriteSpot(type, spotId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/photos")
    public ResponseEntity<List<DatedPhotosGroupDto>> getSortedUserPhotos(@RequestParam PhotoSortType type, @RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to) throws UnsupportedPhotoSortTypeException {
        return ResponseEntity.ok(userDashboardService.getSortedUserPhotos(type, from, to));
    }
}
