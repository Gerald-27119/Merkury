package com.merkury.vulcanus.model.dtos.account.social;

import java.util.List;

public record SocialPageDto(List<SocialDto> items, boolean hasNext) {
}
