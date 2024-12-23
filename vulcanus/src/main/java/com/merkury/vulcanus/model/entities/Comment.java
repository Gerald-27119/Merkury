package com.merkury.vulcanus.model.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
