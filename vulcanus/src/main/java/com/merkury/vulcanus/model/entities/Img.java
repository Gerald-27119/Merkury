package com.merkury.vulcanus.model.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    private String url;
    private String description;
    private String alt;
    private long likes;
    private long views;
    @ManyToOne
    private UserEntity author;
    @Id
    private Long id;


}
