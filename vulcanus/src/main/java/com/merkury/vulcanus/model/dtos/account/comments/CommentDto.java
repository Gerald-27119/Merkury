package com.merkury.vulcanus.model.dtos.account.comments;

import lombok.Builder;

import java.time.LocalTime;

@Builder
public record CommentDto(LocalTime addTime,
                         Long id,
                         String text,
                         String spotName) {
}
