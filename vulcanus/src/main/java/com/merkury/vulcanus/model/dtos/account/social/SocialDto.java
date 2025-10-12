package com.merkury.vulcanus.model.dtos.account.social;

import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import lombok.Builder;
import org.springframework.lang.Nullable;

@Builder
public record SocialDto(String username,
                        String profilePhoto,
                        @Nullable Long commonPrivateChatId,
                        boolean isUserFriend,
                        UserFriendStatus status) {
}
