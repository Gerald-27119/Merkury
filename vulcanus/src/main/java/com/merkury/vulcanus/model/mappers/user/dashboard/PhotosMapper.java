package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.photos.PhotoDto;
import com.merkury.vulcanus.model.dtos.account.photos.DatedPhotosGroupDto;
import com.merkury.vulcanus.model.entities.Img;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class PhotosMapper {
    private PhotosMapper() {
    }

    public static PhotoDto toDto(@NotNull Img img){
        return PhotoDto.builder()
                .id(img.getId())
                .heartsCount(img.getLikes())
                .viewsCount(img.getViews())
                .src(img.getUrl())
                .build();
    }

    public static DatedPhotosGroupDto toDto(@NotNull LocalDate date, List<PhotoDto> photos){
        return DatedPhotosGroupDto.builder()
                .date(date)
                .photos(photos)
                .build();
    }
}
