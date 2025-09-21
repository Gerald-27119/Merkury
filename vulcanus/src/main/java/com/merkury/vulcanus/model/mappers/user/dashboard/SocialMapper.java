package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.FriendView;
import jakarta.validation.constraints.NotNull;
import org.springframework.lang.Nullable;

public class SocialMapper {
    private SocialMapper() {
    }

    public static SocialDto toDto(@NotNull Friendship friendship, @Nullable Long commonPrivateChatId) {
        return SocialDto.builder()
                .username(friendship.getFriend().getUsername())
                .profilePhoto(friendship.getFriend().getProfilePhoto())
                .commonPrivateChatId(commonPrivateChatId)
                .build();
    }

    public static SocialDto toDto(@NotNull UserEntity userEntity, @Nullable Long commonPrivateChatId) {
        return SocialDto.builder()
                .username(userEntity.getUsername())
                .profilePhoto(userEntity.getProfilePhoto())
                .commonPrivateChatId(commonPrivateChatId)//TODO:sprawdz czy w miejscach wywolan to dziala i pozostale 2 metody
                .build();
    }

    public static SocialDto toDto(@NotNull FriendView friendView, @Nullable Long commonPrivateChatId) {
        return SocialDto.builder()
                .username(friendView.getFriend().getUsername())
                .profilePhoto(friendView.getFriend().getProfilePhoto())
                .commonPrivateChatId(commonPrivateChatId)
                .build();
    }
}
