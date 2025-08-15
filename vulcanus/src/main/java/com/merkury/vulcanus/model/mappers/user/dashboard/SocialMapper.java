package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.FriendView;
import jakarta.validation.constraints.NotNull;

public class SocialMapper {
    private SocialMapper() {
    }

    public static SocialDto toDto(@NotNull Friendship friendship) {
        return SocialDto.builder()
                .username(friendship.getFriend().getUsername())
                .profilePhoto(friendship.getFriend().getProfilePhoto())
                .build();
    }

    public static SocialDto toDto(@NotNull UserEntity userEntity) {
        return SocialDto.builder()
                .username(userEntity.getUsername())
                .profilePhoto(userEntity.getProfilePhoto())
                .build();
    }

    public static SocialDto toDto(@NotNull FriendView friendView) {
        return SocialDto.builder()
                .username(friendView.getFriend().getUsername())
                .profilePhoto(friendView.getFriend().getProfilePhoto())
                .build();
    }
}
