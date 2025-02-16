package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    @Builder.Default
    private Double rating = 0.0;
    @Builder.Default
    private Integer likes = 0;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    @ToString.Exclude
    private Spot spot;

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
