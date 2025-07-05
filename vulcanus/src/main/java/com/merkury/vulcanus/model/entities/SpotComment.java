package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "spot_comments")
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SpotComment extends Comment {

    @Column(length = 300)
    private String text;

    @Builder.Default
    private Double rating = 0.0;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    @ToString.Exclude
    private Spot spot;

    @OneToMany(mappedBy = "spotComment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<SpotCommentPhoto> photos = new ArrayList<>();
}
