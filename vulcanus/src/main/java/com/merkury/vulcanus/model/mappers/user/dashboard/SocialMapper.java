package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.FriendView;
import jakarta.validation.constraints.NotNull;
import org.springframework.lang.Nullable;

public class SocialMapper {
    private SocialMapper() {
    }

    public static SocialDto userEntityToSocialDto(@NotNull UserEntity userEntity, @Nullable Long commonPrivateChatId, boolean isUserFriend) {
        return SocialDto.builder()
                .username(userEntity.getUsername())
                .profilePhoto(userEntity.getProfilePhoto())
                .commonPrivateChatId(commonPrivateChatId)
                .isUserFriend(isUserFriend)
                .build();
    }

    public static SocialDto friendViewToSocialDto(@NotNull FriendView friendView, @Nullable Long commonPrivateChatId, boolean isUserFriend) {
        return SocialDto.builder()
                .username(friendView.getFriend().getUsername())
                .profilePhoto(friendView.getFriend().getProfilePhoto())
                .commonPrivateChatId(commonPrivateChatId)
                .isUserFriend(isUserFriend)
                .build();
    }

    public static SocialDto toDto(@NotNull UserEntity userEntity, boolean isUserFriend) {
        return SocialDto.builder()
                .username(userEntity.getUsername())
                .profilePhoto(userEntity.getProfilePhoto())
                .isUserFriend(isUserFriend)
                .build();
    }
}
