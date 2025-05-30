package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.enums.user.dashboard.SpotsListType;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "favorite_spots")
public class FavoriteSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private SpotsListType type;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private Spot spot;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
}
