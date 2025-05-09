package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.AuthorDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class AuthorMapper {

    public AuthorMapper() {}

    public static AuthorDto toDto(@NotNull UserEntity user) {
        return AuthorDto.builder()
                .userName(user.getUsername())
                .profilePhoto(user.getProfilePhoto())
                .build();
    }
}
