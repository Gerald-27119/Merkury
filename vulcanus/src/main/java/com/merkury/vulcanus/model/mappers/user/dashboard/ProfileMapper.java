package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.ImageDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ProfileMapper {
    private ProfileMapper() {
    }

    public static ImageDto toDto(@NotNull SpotMedia spotMedia) {
        return ImageDto.builder()
                .src(spotMedia.getUrl())
                .heartsCount(spotMedia.getLikes())
                .viewsCount(spotMedia.getViews())
                .title(spotMedia.getAlt())
                .id(spotMedia.getId())
                .build();
    }

    public static UserProfileDto toDto(@NotNull UserEntity user, @NotNull List<ImageDto> imageDto) {
        return UserProfileDto.builder()
                .username(user.getUsername())
                .profilePhoto(user.getProfilePhoto())
                .followersCount(user.getFollowers().size())
                .followedCount(user.getFollowed().size())
                .friendsCount(user.getFriendships().stream().filter(f -> f.getStatus().equals(UserFriendStatus.ACCEPTED)).toList().size())
                .photosCount(user.getMedia()
                        .stream()
                        .filter(spotMedia -> spotMedia.getGenericMediaType() == GenericMediaType.PHOTO)
                        .toList()
                        .size())
                .mostPopularPhotos(imageDto)
                .build();
    }

    public static ExtendedUserProfileDto toDto(@NotNull UserProfileDto user, UserFriendStatus friendStatus, Boolean isFollowing, Boolean isOwnProfile) {
        return ExtendedUserProfileDto.builder().profile(user)
                .friendStatus(friendStatus)
                .isFollowing(isFollowing)
                .isOwnProfile(isOwnProfile)
                .build();
    }
}
