package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.SpotCommentPhotoDto;
import com.merkury.vulcanus.model.entities.SpotCommentPhoto;

public class SpotCommentPhotoMapper {
    private SpotCommentPhotoMapper() {}

    public static SpotCommentPhotoDto toDto (SpotCommentPhoto photo) {
        return SpotCommentPhotoDto.builder()
                .url(photo.getUrl())
                .build();
    }
}
