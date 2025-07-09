package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.ImageDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.MediaType;
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
                .friendsCount(user.getFriendships().size())
                .photosCount(user.getMedia()
                        .stream()
                        .filter(spotMedia -> spotMedia.getMediaType() == MediaType.PHOTO)
                        .toList()
                        .size())
                .mostPopularPhotos(imageDto)
                .build();
    }

    public static ExtendedUserProfileDto toDto(@NotNull UserProfileDto user, Boolean isFriends, Boolean isFollowing, Boolean isOwnProfile) {
        return ExtendedUserProfileDto.builder().profile(user)
                .isFriends(isFriends)
                .isFollowing(isFollowing)
                .isOwnProfile(isOwnProfile)
                .build();
    }
}
