package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.enums.MediaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "spot_media")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpotMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String alt;
    private String description;
    @Builder.Default
    private Integer likes = 0;
    @Builder.Default
    private Integer views = 0;
    @Enumerated(value = EnumType.STRING)
    private MediaType mediaType;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private Spot spot;
}
