package com.merkury.vulcanus.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContourCoordinatesDto {
    private List<Double[]> contourCoordinates;
}
