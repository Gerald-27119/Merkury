package com.merkury.vulcanus.model.dtos.account.comments;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record DatedCommentsGroupDto(LocalDate date,
                                    String spotName,
                                    List<CommentDto> comments) {
}
