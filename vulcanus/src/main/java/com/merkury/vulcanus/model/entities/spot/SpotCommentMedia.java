package com.merkury.vulcanus.model.entities.spot;

import com.merkury.vulcanus.model.enums.GenericMediaType;
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

@Entity(name = "spot_comment_media")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SpotCommentMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long idInSpotMedia;
    private String url;
    private GenericMediaType genericMediaType;

    @ManyToOne
    @JoinColumn(name = "spot_comment_id")
    private SpotComment spotComment;
}
