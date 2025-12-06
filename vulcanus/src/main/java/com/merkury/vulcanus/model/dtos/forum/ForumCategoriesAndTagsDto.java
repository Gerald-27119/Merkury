package com.merkury.vulcanus.model.dtos.forum;

import lombok.Builder;

import java.util.List;

@Builder
public record ForumCategoriesAndTagsDto(List<PostCategoryDto> categories,
                                        List<PostTagDto> tags) {
}
