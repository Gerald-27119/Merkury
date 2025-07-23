package com.merkury.vulcanus.model.mappers.chat;


import com.merkury.vulcanus.model.dtos.chat.gif.category.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.category.TenorGifCategoryResponse;
import com.merkury.vulcanus.model.dtos.chat.gif.search.TenorGifSearchDto;
import com.merkury.vulcanus.model.dtos.chat.gif.search.TenorGifSearchResponse;
import com.merkury.vulcanus.model.dtos.chat.gif.search.TenorGifSearchWrapperDto;

import java.util.List;

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

    public static TenorGifSearchWrapperDto mapToSearchWrapper(TenorGifSearchResponse response) {
        var gifs = response.getResults().stream()
                .map(result -> TenorGifSearchDto.builder()
                        .url(result.getMedia_formats()
                                .getGif()
                                .getUrl())
                        .build())
                .toList();

        return TenorGifSearchWrapperDto.builder()
                .gifs(gifs)
                .next(response.getNext())
                .build();
    }

}
