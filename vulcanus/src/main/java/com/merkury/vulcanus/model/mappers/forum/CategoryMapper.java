package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.PostCategoryDto;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import jakarta.validation.constraints.NotNull;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static PostCategoryDto toDto(@NotNull PostCategory postCategory) {
        return PostCategoryDto.builder()
                .id(postCategory.getId())
                .name(postCategory.getName())
                .description(postCategory.getDescription())
                .colour(postCategory.getColour())
                .build();
    }
}
