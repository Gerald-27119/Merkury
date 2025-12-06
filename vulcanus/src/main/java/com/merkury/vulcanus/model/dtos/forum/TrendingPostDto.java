package com.merkury.vulcanus.model.dtos.forum;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TrendingPostDto(
        Long id,
        String title,
        String slugTitle,
        AuthorDto author,
        LocalDateTime publishDate
        ) {
}
