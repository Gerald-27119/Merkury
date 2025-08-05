package com.merkury.vulcanus.model.dtos.chat.gif.search;

import lombok.Builder;

import java.util.List;

@Builder
public record TenorGifSearchWrapperDto(List<TenorGifSearchDto> gifs, String next) {
}
