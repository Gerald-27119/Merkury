package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.ImgDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class ImgMapper {
    private ImgMapper() {
    }

    public static ImgDto toDto(@NotNull Img img) {
        return ImgDto.builder()
                .id(img.getId())
                .img(img.getUrl())
                .title(img.getAlt())
                .description(img.getDescription())
                .likes(img.getLikes())
                .views(img.getViews())
                .author(img.getAuthor().getUsername())
                .build();
    }

    public static Img toEntity(@NotNull ImgDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return Img.builder()
                .url(dto.img())
                .alt(dto.title())
                .description(dto.description())
                .likes(dto.likes())
                .views(dto.views())
                .author(author)
                .build();
    }
}

