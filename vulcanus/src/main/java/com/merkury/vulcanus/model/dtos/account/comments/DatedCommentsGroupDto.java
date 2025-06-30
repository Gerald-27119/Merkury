package com.merkury.vulcanus.model.dtos.account.comments;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record DatedCommentsGroupDto(LocalDate addDate,
                                    String spotName,
                                    List<CommentDto> comments) {
}
