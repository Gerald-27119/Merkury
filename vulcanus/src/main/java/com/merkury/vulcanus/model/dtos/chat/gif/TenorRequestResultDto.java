package com.merkury.vulcanus.model.dtos.chat.gif;

import lombok.Builder;

import java.util.List;

@Builder
public record TenorRequestResultDto(String next, List<TenorGifDto> gifs) {
}

