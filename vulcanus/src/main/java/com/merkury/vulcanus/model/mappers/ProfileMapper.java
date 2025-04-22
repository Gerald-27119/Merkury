package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.account.profile.ImageDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ProfileMapper {
    private ProfileMapper() {
    }

    public static ImageDto toDto(@NotNull Img img){
        return ImageDto.builder()
                .src(img.getUrl())
                .heartsCount(img.getLikes())
                .viewsCount(img.getViews())
                .title(img.getAlt())
                .build();
    }

    public static UserProfileDto toDto(@NotNull UserEntity user, @NotNull List<ImageDto> imageDto){
        return UserProfileDto.builder()
                .username(user.getUsername())
                .profilePhoto(user.getProfilePhoto())
                .followersCount(user.getFollowers().size())
                .followedCount(user.getFollowed().size())
                .friendsCount(user.getFriendships().size())
                .photosCount(user.getImages().size())
                .mostPopularPhotos(imageDto)
                .build();
    }
}
