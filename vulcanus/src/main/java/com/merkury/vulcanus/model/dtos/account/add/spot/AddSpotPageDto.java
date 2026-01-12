package com.merkury.vulcanus.model.dtos.account.add.spot;

import java.util.List;

public record AddSpotPageDto(List<AddSpotDto> items, boolean hasNext) {
}
