package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserDashboardController {
    private final UserDashboardService userDashboardService;

    @GetMapping("/user-dashboard/profile")
    public ResponseEntity<UserProfileDto> getUserOwnProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var user = userDashboardService.getUserOwnProfile(request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/public/user-dashboard/profile/{targetUsername}")
    public ResponseEntity<ExtendedUserProfileDto> getUserProfileForViewer(HttpServletRequest request, @PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        var user = userDashboardService.getUserProfileForViewer(request, targetUsername);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user-dashboard/friends")
    public ResponseEntity<List<SocialDto>> getUserOwnFriends(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFriends(request));
    }

    @GetMapping("/public/user-dashboard/friends/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFriendsForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriendsForViewer(targetUsername));
    }

    @PatchMapping("/user-dashboard/friends")
    public ResponseEntity<Void> editUserFriends(HttpServletRequest request, @RequestParam String friendUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFriends(request, friendUsername, type);
        return ResponseEntity.ok().build();
    }

    /// TODO na frontendzie na razie nie jest to obsłużone będzie to zrobione w innym zadaniu
    @PatchMapping("/user-dashboard/friends/change-status")
    public ResponseEntity<Void> changeUserFriendsStatus(HttpServletRequest request, @RequestParam String friendUsername, @RequestParam UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        userDashboardService.changeUserFriendsStatus(request, friendUsername, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/followers")
    public ResponseEntity<List<SocialDto>> getUserOwnFollowers(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowers(request));
    }

    @GetMapping("/public/user-dashboard/followers/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFollowersForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowersForViewer(targetUsername));
    }

    @GetMapping("/user-dashboard/followed")
    public ResponseEntity<List<SocialDto>> getUserOwnFollowed(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserOwnFollowed(request));
    }

    @GetMapping("/public/user-dashboard/followed/{targetUsername}")
    public ResponseEntity<List<SocialDto>> getUserFollowedForViewer(@PathVariable String targetUsername) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowedForViewer(targetUsername));
    }

    @PatchMapping("/user-dashboard/followed")
    public ResponseEntity<Void> editUserFollowed(HttpServletRequest request, @RequestParam String followedUsername, @RequestParam UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFollowed(request, followedUsername, type);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<List<FavoriteSpotDto>> getAllUserFavoritesSpots(HttpServletRequest request, @RequestParam FavoriteSpotsListType type){
        return ResponseEntity.ok(userDashboardService.getUserFavoritesSpots(request, type));
    }

    @PatchMapping("/user-dashboard/favorite-spots")
    public ResponseEntity<Void> removeFavoriteSpot(HttpServletRequest request, @RequestParam FavoriteSpotsListType type, @RequestParam Long spotId) throws FavoriteSpotNotExistException {
        userDashboardService.removeFavoriteSpot(request, type, spotId);
       return ResponseEntity.ok().build();
    }
}
