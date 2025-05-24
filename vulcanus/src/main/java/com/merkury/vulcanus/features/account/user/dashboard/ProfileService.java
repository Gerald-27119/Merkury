package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.ImageDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.mappers.user.dashboard.ProfileMapper;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityFetcher userEntityFetcher;

    public UserProfileDto getUserPrivateProfile(String username) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(username);
        var images = get4MostPopularPhotosFromUser(user);
        return ProfileMapper.toDto(user, images);
    }

    public ExtendedUserProfileDto getUserPublicProfile(String username, String anotherUsername) throws UserNotFoundByUsernameException {
        if (username != null) {
            var user = userEntityFetcher.getByUsername(username);
            var isFriends = false;
            var isFollowing = false;
            var isOwnProfile = username.equals(anotherUsername);

            var anotherUser = userEntityFetcher.getByUsername(anotherUsername);
            isFriends = getIsUsersFriends(user, anotherUser);
            isFollowing = getIsUsersFollowing(user, anotherUser);
            user = anotherUser;

            var images = get4MostPopularPhotosFromUser(user);
            return ProfileMapper.toDto(ProfileMapper.toDto(user, images), isFriends, isFollowing, isOwnProfile);
        } else {
            var anotherUser = userEntityFetcher.getByUsername(anotherUsername);

            var images = get4MostPopularPhotosFromUser(anotherUser);
            return ProfileMapper.toDto(ProfileMapper.toDto(anotherUser, images), false, false, false);
        }
    }

    private Boolean getIsUsersFriends(UserEntity user, UserEntity secondUser) {
        return user.getFriendships().stream().anyMatch(f -> f.getFriend().equals(secondUser));
    }

    private Boolean getIsUsersFollowing(UserEntity user, UserEntity secondUser) {
        return user.getFollowed().stream().anyMatch(f -> f.equals(secondUser));
    }

    private List<ImageDto> get4MostPopularPhotosFromUser(UserEntity user) {
        return user.getImages().stream()
                .sorted(Comparator.comparingInt(Img::getLikes).reversed())
                .limit(4)
                .map(ProfileMapper::toDto)
                .toList();
    }
}
