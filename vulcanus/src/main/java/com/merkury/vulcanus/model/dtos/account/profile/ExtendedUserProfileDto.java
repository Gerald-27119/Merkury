package com.merkury.vulcanus.model.dtos.account.profile;

import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import lombok.Builder;

@Builder
public record ExtendedUserProfileDto(UserProfileDto profile,
                                     UserFriendStatus friendStatus,
                                     Boolean isFollowing,
                                     Boolean isOwnProfile)  {
}
