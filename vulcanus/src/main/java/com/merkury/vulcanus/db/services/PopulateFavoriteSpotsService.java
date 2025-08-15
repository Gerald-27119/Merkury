package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PopulateFavoriteSpotsService {
    private final UserEntityRepository userEntityRepository;
    private final SpotRepository spotRepository;
    private final FavoriteSpotRepository favoriteSpotRepository;

    @Transactional
    public void initFavoriteSpotsData() {
        var user = userEntityRepository.findByUsername("user").orElseThrow();
        var allSpots = spotRepository.findAll();

        var spots1 = allSpots.subList(0, 2);
        var spots2 = allSpots.subList(2, 4);
        var spots3 = allSpots.subList(4, 6);
        var spots4 = allSpots.subList(8, 10);

        for (var spot : spots1) {
            var favoriteSpot = FavoriteSpot
                    .builder()
                    .spot(spot)
                    .user(user)
                    .type(FavoriteSpotsListType.FAVORITE)
                    .build();

            favoriteSpotRepository.save(favoriteSpot);
        }

        for (var spot : spots2) {
            var favoriteSpot = FavoriteSpot
                    .builder()
                    .spot(spot)
                    .user(user)
                    .type(FavoriteSpotsListType.PLAN_TO_VISIT)
                    .build();

            favoriteSpotRepository.save(favoriteSpot);
        }

        for (var spot : spots3) {
            var favoriteSpot = FavoriteSpot
                    .builder()
                    .spot(spot)
                    .user(user)
                    .type(FavoriteSpotsListType.VISITED_LIKED_IT)
                    .build();

            favoriteSpotRepository.save(favoriteSpot);
        }

        for (var spot : spots4) {
            var favoriteSpot = FavoriteSpot
                    .builder()
                    .spot(spot)
                    .user(user)
                    .type(FavoriteSpotsListType.VISITED_NOT_LIKED_IT)
                    .build();

            favoriteSpotRepository.save(favoriteSpot);
        }
    }
}
