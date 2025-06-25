package com.merkury.vulcanus.model.dtos.account.photos;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record DatedPhotosGroupDto(LocalDate date,
                                  List<PhotoDto> photos) {
}
