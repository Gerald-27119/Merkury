package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "spot_comment_photo")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SpotCommentPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String url;

    @ManyToOne
    @JoinColumn(name = "spot_comment_id")
    private SpotComment spotComment;
}
