package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.ForumTagDto;
import com.merkury.vulcanus.model.entities.forum.Tag;
import jakarta.validation.constraints.NotNull;

public class TagMapper {

    private TagMapper() {

    }

    public static ForumTagDto toDto(@NotNull Tag tag) {
        return ForumTagDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }

}
