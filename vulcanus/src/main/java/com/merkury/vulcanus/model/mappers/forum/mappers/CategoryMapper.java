package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.CategoryDto;
import com.merkury.vulcanus.model.entities.forum.Category;
import jakarta.validation.constraints.NotNull;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryDto toDto(@NotNull Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .colour(category.getColour())
                .build();
    }
}
