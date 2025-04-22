package com.merkury.vulcanus.model.dtos.account.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.util.List;

@Builder
public record UserProfileDto(@NotBlank(message = "Username cannot be empty.")
                             String username,
                             @NotBlank(message = "ProfilePhoto cannot be empty.")
                             String profilePhoto,
                             @Positive(message = "FollowersCount must be a positive number.")
                             Integer followersCount,
                             @Positive(message = "FollowedCount must be a positive number.")
                             Integer followedCount,
                             @Positive(message = "FriendsCount must be a positive number.")
                             Integer friendsCount,
                             @Positive(message = "PhotosCount must be a positive number.")
                             Integer photosCount,
                             @NotEmpty(message = "Photos list cannot be empty.")
                             List<ImageDto> mostPopularPhotos) {
}
