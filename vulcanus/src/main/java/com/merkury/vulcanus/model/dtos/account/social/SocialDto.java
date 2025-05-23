package com.merkury.vulcanus.model.dtos.account.social;

import lombok.Builder;

@Builder
public record SocialDto(String username,
                        String profilePhoto) {
}
