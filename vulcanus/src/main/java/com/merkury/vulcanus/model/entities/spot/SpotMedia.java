package com.merkury.vulcanus.model.entities.spot;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
    private GenericMediaType genericMediaType;
    @Builder.Default
    private LocalDate addDate = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private Spot spot;

    @ManyToMany(mappedBy = "likedSpotMedia")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @Builder.Default
    private Set<UserEntity> likedBy = new HashSet<>();
}
