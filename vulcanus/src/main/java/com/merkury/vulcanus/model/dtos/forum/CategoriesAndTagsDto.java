package com.merkury.vulcanus.model.dtos.forum;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoriesAndTagsDto(List<CategoryDto> categories,
                                   List<TagDto> tags) {
}
