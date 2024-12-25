package com.merkury.vulcanus.model.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    public Img(String url, String alt, String description, Integer likes, Integer views, UserEntity author, Spot spot) {
        this.url = url;
        this.alt = alt;
        this.description = description;
        this.likes = likes;
        this.views = views;
        this.author = author;
        this.spot = spot;
    }
}
