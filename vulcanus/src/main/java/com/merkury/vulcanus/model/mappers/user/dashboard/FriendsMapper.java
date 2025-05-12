package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class FriendsMapper {
    private FriendsMapper() {
    }

    public static FriendDto toDto(@NotNull Friendship friendship){
        return FriendDto.builder()
                .username(friendship.getFriend().getUsername())
                .profilePhoto(friendship.getFriend().getProfilePhoto())
                .build();
    }

    public static FriendDto toDto(@NotNull UserEntity userEntity){
        return FriendDto.builder()
                .username(userEntity.getUsername())
                .profilePhoto(userEntity.getProfilePhoto())
                .build();
    }
}
