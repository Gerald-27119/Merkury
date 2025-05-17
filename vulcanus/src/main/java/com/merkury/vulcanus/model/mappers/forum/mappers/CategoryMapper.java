package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.CategoryDto;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import jakarta.validation.constraints.NotNull;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryDto toDto(@NotNull PostCategory postCategory) {
        return CategoryDto.builder()
                .id(postCategory.getId())
                .name(postCategory.getName())
                .description(postCategory.getDescription())
                .colour(postCategory.getColour())
                .build();
    }
}
