package com.merkury.vulcanus.model.dtos.account.profile;

import lombok.Builder;

@Builder
public record ExtendedUserProfileDto(UserProfileDto profile,
                                     Boolean isFriends,
                                     Boolean isFollowing,
                                     Boolean isOwnProfile)  {
}
