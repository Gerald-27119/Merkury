package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.PostTagDto;
import com.merkury.vulcanus.model.entities.forum.Tag;
import jakarta.validation.constraints.NotNull;

public class TagMapper {

    private TagMapper() {

    }

    public static PostTagDto toDto(@NotNull Tag tag) {
        return PostTagDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }

}
