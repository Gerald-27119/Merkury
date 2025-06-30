package com.merkury.vulcanus.model.dtos.account.comments;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.LocalTime;

@Builder
public record CommentDto(@JsonFormat(pattern = "HH:mm")
                         LocalTime addTime,
                         Long id,
                         String text,
                         String spotName) {
}
