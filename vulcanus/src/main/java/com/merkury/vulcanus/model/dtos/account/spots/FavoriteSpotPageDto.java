package com.merkury.vulcanus.model.dtos.account.spots;

import java.util.List;

public record FavoriteSpotPageDto(List<FavoriteSpotDto> items, boolean hasNext) {
}
