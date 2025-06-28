package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.SpotCommentAuthorDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class SpotCommentAuthorMapper {
    private SpotCommentAuthorMapper() {}

    public static SpotCommentAuthorDto toDto(@NotNull UserEntity author) {
       return SpotCommentAuthorDto.builder()
               .username(author.getUsername())
               .profilePhotoUrl(author.getProfilePhoto())
               .build();
    }
}
