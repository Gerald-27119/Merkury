package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.SpotMediaDto;
import com.merkury.vulcanus.model.entities.SpotMedia;
import jakarta.validation.constraints.NotNull;

public class SpotMediaMapper {
    private SpotMediaMapper() {}

    public static SpotMediaDto toDto(@NotNull SpotMedia spotMedia) {
        return SpotMediaDto.builder()
                .id(spotMedia.getId())
                .img(spotMedia.getUrl())
                .title(spotMedia.getAlt())
                .description(spotMedia.getDescription())
                .likes(spotMedia.getLikes())
                .views(spotMedia.getViews())
                .author(spotMedia.getAuthor().getUsername())
                .mediaType(spotMedia.getMediaType())
                .build();
    }
}
