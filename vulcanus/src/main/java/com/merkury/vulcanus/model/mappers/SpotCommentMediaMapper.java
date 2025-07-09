package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.SpotCommentMediaDto;
import com.merkury.vulcanus.model.entities.SpotCommentMedia;
import jakarta.validation.constraints.NotNull;

public class SpotCommentMediaMapper {
    private SpotCommentMediaMapper() {}

    public static SpotCommentMediaDto toDto(@NotNull SpotCommentMedia spotCommentMedia) {
        return SpotCommentMediaDto.builder()
                .id(spotCommentMedia.getId())
                .genericMediaType(spotCommentMedia.getGenericMediaType())
                .url(spotCommentMedia.getUrl())
                .build();
    }
}
