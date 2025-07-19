package com.merkury.vulcanus.model.mappers.chat;


import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryResponse;

import java.util.List;

public class TenorMapper {

    public static List<TenorGifCategoryDto> mapToGifCategoryDtos(TenorGifCategoryResponse categoryResponse) {
        return categoryResponse.getTags().stream()
                .map(tag -> TenorGifCategoryDto.builder()
                        .searchTerm(tag.getSearchTerm())
                        .path(tag.getPath())
                        .gifUrl(tag.getImage())
                        .build())
                .toList();
    }

}
