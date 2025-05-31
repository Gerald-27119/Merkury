package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.FavoriteSpot;
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
    public void initFavoriteSpots(){
        var user = userEntityRepository.findByUsername("user").get();
        var spots = spotRepository.findAll();

        for (var spot : spots){
            var favoriteSpot = FavoriteSpot
                    .builder()
                    .spot(spot)
                    .user(user)
                    .type(FavoriteSpotsListType.FAVORITE)
                    .build();

            favoriteSpotRepository.save(favoriteSpot);
        }
    }
}
