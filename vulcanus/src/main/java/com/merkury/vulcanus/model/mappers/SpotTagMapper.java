package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.SpotTagDto;
import com.merkury.vulcanus.model.entities.SpotTag;
import jakarta.validation.constraints.NotNull;

public class SpotTagMapper {
    private SpotTagMapper() {}

    public static SpotTagDto toDto(@NotNull SpotTag spotTag) {
        return SpotTagDto.builder()
                .id(spotTag.getId())
                .name(spotTag.getName())
                .build();
    }
}
