package com.merkury.vulcanus.model.dtos.chat.gif;

import lombok.Builder;

@Builder
public record TenorGifCategoryDto(String searchTerm, String path, String gifUrl) {
}
