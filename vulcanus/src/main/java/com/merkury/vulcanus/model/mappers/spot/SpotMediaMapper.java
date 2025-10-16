package com.merkury.vulcanus.model.mappers.spot;

import com.merkury.vulcanus.model.dtos.spot.SpotMediaDto;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotMediaGalleryDto;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotSidebarMediaGalleryDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import jakarta.validation.constraints.NotNull;

public class SpotMediaMapper {
    private SpotMediaMapper() {}

    public static SpotMediaDto toDto(@NotNull SpotMedia spotMedia) {
        return SpotMediaDto.builder()
                .id(spotMedia.getId())
                .url(spotMedia.getUrl())
                .title(spotMedia.getAlt())
                .description(spotMedia.getDescription())
                .likes(spotMedia.getLikes())
                .views(spotMedia.getViews())
                .author(spotMedia.getAuthor().getUsername())
                .genericMediaType(spotMedia.getGenericMediaType())
                .build();
    }

    public static SpotMediaGalleryDto toGalleryDto(@NotNull SpotMedia spotMedia) {
        return SpotMediaGalleryDto.builder()
                .id(spotMedia.getId())
                .url(spotMedia.getUrl())
                .authorName(spotMedia.getAuthor().getUsername())
                .authorProfilePhotoUrl(spotMedia.getAuthor().getProfilePhoto())
                .likesNumber(spotMedia.getLikes())
                .publishDate(spotMedia.getAddDate())
                .mediaType(spotMedia.getGenericMediaType())
                .build();
    }

    public static SpotSidebarMediaGalleryDto toSidebarGalleryDto(@NotNull SpotMedia spotMedia) {
        return SpotSidebarMediaGalleryDto.builder()
                .id(spotMedia.getId())
                .mediaType(spotMedia.getGenericMediaType())
                .url(spotMedia.getUrl())
                .build();
    }
}
