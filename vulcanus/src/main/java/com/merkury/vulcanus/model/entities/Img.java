package com.merkury.vulcanus.model.entities;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class Img {

    private String url;
    private String description;
    private String alt;
    private long likes;
    private long views;
    @ManyToOne
    private UserEntity author;
}
