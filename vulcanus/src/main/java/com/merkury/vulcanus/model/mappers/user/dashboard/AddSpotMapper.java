package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.enums.GenericMediaType;

public class AddSpotMapper {
    private AddSpotMapper() {
    }

    public static AddSpotDto toDto(Spot spot){
        return AddSpotDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .description(spot.getDescription())
                .country(spot.getCountry())
                .region(spot.getRegion())
                .city(spot.getCity())
                .street(spot.getStreet())
                .borderPoints(spot.getBorderPoints())
                .firstPhotoUrl(spot.getMedia()
                        .stream()
                        .filter(spotMedia -> spotMedia.getGenericMediaType().equals(GenericMediaType.PHOTO))
                        .findFirst()
                        .orElseThrow()
                        .getUrl())
                .build();
    }
}
