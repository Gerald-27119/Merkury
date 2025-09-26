package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.enums.SpotRatingFilterType;
import com.merkury.vulcanus.model.enums.SpotSortType;

import java.util.List;

public record SpotSearchRequestDto(String city,
                                   List<String> tags,
                                   SpotSortType sort,
                                   SpotRatingFilterType filter) {
}
