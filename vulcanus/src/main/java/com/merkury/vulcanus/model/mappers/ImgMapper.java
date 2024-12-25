package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.ImgDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;

import java.util.List;
import java.util.stream.Collectors;

public class ImgMapper {

    public static ImgDto toDto(Img img) {
        if (img == null) {
            return null;
        }

        ImgDto dto = new ImgDto();
        dto.setId(img.getId());
        dto.setUrl(img.getUrl());
        dto.setAlt(img.getAlt());
        dto.setDescription(img.getDescription());
        dto.setLikes(img.getLikes());
        dto.setViews(img.getViews());

        dto.setAuthor(img.getAuthor() != null ? img.getAuthor().getUsername() : null);

        return dto;
    }

    public static Img toEntity(ImgDto dto, Spot spot, UserEntity author) {
        if (dto == null) {
            return null;
        }

        Img img = new Img();
        img.setId(dto.getId());
        img.setUrl(dto.getUrl());
        img.setAlt(dto.getAlt());
        img.setDescription(dto.getDescription());
        img.setLikes(dto.getLikes());
        img.setViews(dto.getViews());
        img.setSpot(spot);
        img.setAuthor(author);

        return img;
    }
}

