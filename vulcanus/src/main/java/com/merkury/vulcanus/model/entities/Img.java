package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Integer likes;
    private Integer views;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private Spot spot;

    @PrePersist
    public void prePersist() {
        if (likes == null) {
            likes = 0;
        }
        if (views == null) {
            views = 0;
        }
    }
}