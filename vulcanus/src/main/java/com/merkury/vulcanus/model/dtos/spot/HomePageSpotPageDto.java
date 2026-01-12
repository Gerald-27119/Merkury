package com.merkury.vulcanus.model.dtos.spot;


import java.util.List;

public record HomePageSpotPageDto(List<HomePageSpotDto> items, boolean hasNext) {
}
