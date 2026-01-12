package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.media.MediaDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class MediaMapper {
    private MediaMapper() {
    }

    public static MediaDto toDto(@NotNull SpotMedia spotMedia){
        return MediaDto.builder()
                .id(spotMedia.getId())
                .heartsCount(spotMedia.getLikes())
                .viewsCount(spotMedia.getViews())
                .src(spotMedia.getUrl())
                .build();
    }

    public static DatedMediaGroupDto toDto(@NotNull LocalDate date, List<MediaDto> media){
        return DatedMediaGroupDto.builder()
                .date(date)
                .media(media)
                .build();
    }
}
