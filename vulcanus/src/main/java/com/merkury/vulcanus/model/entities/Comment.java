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
    private Double rating;
    private Integer likes;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    @ToString.Exclude
    private Spot spot;

    private LocalDateTime publishDate;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
