package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "tags")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Builder.Default
    @ManyToMany(mappedBy = "tags")
    private List<Spot> spots = new ArrayList<>();
}
