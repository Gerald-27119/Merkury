package com.merkury.vulcanus.model.mappers.chat;


import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryResponse;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class TenorMapper {

    public static List<TenorGifCategoryDto> mapToGifCategoryDtos(TenorGifCategoryResponse categoryResponse) {
        return categoryResponse.getTags().stream()
                .map(tag -> TenorGifCategoryDto.builder()
                        .searchTerm(tag.getSearchterm())
                        .path(tag.getPath())
                        .gifUrl(tag.getImage())
                        .build())
                .toList();
    }

}
