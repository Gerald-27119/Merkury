package com.merkury.vulcanus.model.entities;

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

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Point> borderPoints = new ArrayList<>();

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
