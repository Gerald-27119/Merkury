package com.merkury.vulcanus.model.dtos.spot;

import java.util.List;

public record SpotSearchRequestDto(String city,
                                   List<SpotTagDto> tags) {
}
