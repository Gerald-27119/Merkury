package com.merkury.vulcanus.model.entities.spot;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "spots_tags")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class SpotTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Builder.Default
    @ManyToMany(mappedBy = "tags")
    private Set<Spot> spots = new HashSet<>();
}
