package com.merkury.vulcanus.model.dtos.account.social;

import lombok.Builder;

@Builder
public record ExtendedSocialDto(SocialDto social,
                                boolean isCurrentlyRelated,
                                boolean isOwnProfile) {
}
