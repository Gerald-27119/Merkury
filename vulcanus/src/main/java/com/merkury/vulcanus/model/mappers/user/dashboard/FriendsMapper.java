package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.entities.Friendship;
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
}
