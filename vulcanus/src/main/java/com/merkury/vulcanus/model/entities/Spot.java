package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.converters.BorderPointListConverter;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
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
     * This field is stored as a TEXT column in the database using the custom
     * {@link BorderPointListConverter}. The converter serializes the list into a TEXT string that looks like JSON,
     * when persisting the entity and deserializes it back into a {@code List<BorderPoint>},
     * when reading from the database.
     * </p>
     * <p>
     * The {@code columnDefinition = "TEXT"} attribute specifies that the data is stored
     * as a TEXT type in PostgreSQL.
     * </p>
     */
    @Builder.Default
    @Column(columnDefinition = "TEXT")
    @Convert(converter = BorderPointListConverter.class)
    private List<BorderPoint> borderPoints = new ArrayList<>();

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @OrderBy("publishDate DESC")
    private List<Comment> comments = new ArrayList<>();

    private Double rating;
    private Integer viewsCount;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Img> images = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (rating == null) {
            rating = 0.0;
        }
        if (viewsCount == null) {
            viewsCount = 0;
        }
    }
}
