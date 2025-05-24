package com.merkury.vulcanus.model.dtos.account.profile;

import lombok.Builder;

import java.util.List;

@Builder
public record UserProfileDto(String username,
                             String profilePhoto,
                             Integer followersCount,
                             Integer followedCount,
                             Integer friendsCount,
                             Integer photosCount,
                             List<ImageDto> mostPopularPhotos) {
}
