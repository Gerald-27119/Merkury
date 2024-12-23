package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a geographical point.
 */
@Entity(name = "points")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double x;
    private Double y;

    @ManyToOne
    private Spot spot;

    @ManyToOne
    private Zone zone;

    public Point(Double x, Double y, Spot spot) {
        this.x = x;
        this.y = y;
        this.spot = spot;
    }
}
