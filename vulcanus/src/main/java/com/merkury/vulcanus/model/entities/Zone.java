package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.converters.BorderPointListConverter;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a zone restricted by law.
 */
@Entity(name = "zones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private String areaColor = "green";
    private String name;
    private String description;

    @Builder.Default
    @Column(columnDefinition = "TEXT")
    @Convert(converter = BorderPointListConverter.class)
    private List<BorderPoint> borderPoints = new ArrayList<>();

    @Builder.Default
    private Integer AGL = 0;
    @Builder.Default
    private Integer AMSL = 0;
}
