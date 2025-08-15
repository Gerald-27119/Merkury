package com.merkury.vulcanus.model.dtos.account.media;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record DatedMediaGroupDto(LocalDate date,
                                 List<MediaDto> media) {
}
