package com.merkury.vulcanus.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointDto {
    private Double[] coordinates;

    public PointDto(Double x, Double y) {
        this.coordinates = new Double[]{x, y};
    }
}
