package com.merkury.vulcanus.model.dtos.account.friends;

import lombok.Builder;

@Builder
public record FriendDto(String username,
                        String profilePhoto) {
}
