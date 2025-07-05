package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "imgs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Img {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String alt;
    private String description;
    @Builder.Default
    private Integer likes = 0;
    @Builder.Default
    private Integer views = 0;
    @Builder.Default
    private LocalDate addDate = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private Spot spot;
}