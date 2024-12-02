package com.merkury.vulcanus.model.entities;

import java.util.List;

/**
 * Represents a spot where people can go.
 */
public class Spot extends Area{

    private List<Comment> comments;
    private Double rating;
    private Integer viewsCount;
    private List<Img> images;

}
