package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.ForumCategoryDto;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import jakarta.validation.constraints.NotNull;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static ForumCategoryDto toDto(@NotNull PostCategory postCategory) {
        return ForumCategoryDto.builder()
                .id(postCategory.getId())
                .name(postCategory.getName())
                .description(postCategory.getDescription())
                .colour(postCategory.getColour())
                .build();
    }
}
