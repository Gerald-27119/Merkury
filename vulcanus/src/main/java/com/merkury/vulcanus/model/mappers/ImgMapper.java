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

        return new ImgDto(
                img.getUrl(),
                img.getAlt(),
                img.getDescription(),
                img.getLikes(),
                img.getViews(),
                img.getAuthor().getUsername());
    }

    public static Img toEntity(@NotNull ImgDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        Img img = new Img();
        img.setUrl(dto.img());
        img.setAlt(dto.title());
        img.setDescription(dto.description());
        img.setLikes(dto.likes());
        img.setViews(dto.views());
        img.setSpot(spot);
        img.setAuthor(author);

        return img;
    }
}

