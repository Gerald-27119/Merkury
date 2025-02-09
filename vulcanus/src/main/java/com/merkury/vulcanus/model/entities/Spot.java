package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.converters.BorderPointListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a spot where people can go.
 */
@Entity(name = "spots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Spot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String areaColor;
    private String name;
    private String description;

    /**
     * A list of {@link BorderPoint} objects that define the boundary points of the spot.
     * <p>
     * This field is persisted as a JSON string in the database using the custom
     * {@link BorderPointListConverter}. The converter serializes the list to a JSON
     * representation when storing it in the column and deserializes the JSON back to
     * a {@code List<BorderPoint>} when reading the entity.
     * </p>
     * <p>
     * The {@code columnDefinition = "JSON"} attribute specifies that the JSON string is stored
     * in a column of type JSON. Ensure that this type is supported by your underlying database.
     * </p>
     */
    @Convert(converter = BorderPointListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<BorderPoint> borderPoints;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @OrderBy("publishDate DESC")
    private List<Comment> comments = new ArrayList<>();

    private Double rating;
    private Integer viewsCount;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Img> images = new ArrayList<>();
}
