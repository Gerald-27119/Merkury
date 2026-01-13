package com.merkury.vulcanus.model.mappers.spot;

import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentMediaDto;
import com.merkury.vulcanus.model.entities.spot.SpotCommentMedia;
import jakarta.validation.constraints.NotNull;

public class SpotCommentMediaMapper {
    private SpotCommentMediaMapper() {
    }

    public static SpotCommentMediaDto toDto(@NotNull SpotCommentMedia spotCommentMedia) {
        return SpotCommentMediaDto.builder()
                .id(spotCommentMedia.getId())
                .idInSpotMedia(spotCommentMedia.getIdInSpotMedia())
                .genericMediaType(spotCommentMedia.getGenericMediaType())
                .url(spotCommentMedia.getUrl())
                .build();
    }
}
