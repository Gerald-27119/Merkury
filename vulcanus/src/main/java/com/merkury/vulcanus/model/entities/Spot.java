package com.merkury.vulcanus.model.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Point> borderPoints;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    private Double rating;
    private Integer viewsCount;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Img> images;
}
