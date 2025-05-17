package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.TagDto;
import com.merkury.vulcanus.model.entities.forum.Tag;
import jakarta.validation.constraints.NotNull;

public class TagMapper {

    private TagMapper() {

    }

    public static TagDto toDto(@NotNull Tag tag) {
        return TagDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }

}
