package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PopulateFavoriteSpotsService {
    private final UserEntityRepository userEntityRepository;
    private final SpotRepository spotRepository;
    private final FavoriteSpotRepository favoriteSpotRepository;

    @Transactional
    public void initFavoriteSpotsData() {
        List<String> usernames = List.of(
                "annaKowalska",
                "michalNowak",
                "kasiaWisniewska",
                "piotrZielinski",
                "olaLewandowska",
                "tomekWojcik",
                "nataliaKaminska",
                "bartekSzymanski",
                "magdaKozlowska",
                "krzysiekJankowski",
                "julkaMazur",
                "pawelKrawczyk"
        );

        var allSpots = spotRepository.findAll();
        if (allSpots.size() < 12) {
            throw new IllegalStateException("Za mało spotów w DB. Potrzeba min. 12, jest: " + allSpots.size());
        }


        int perList = 3;
        int totalPerUser = perList * 4;

        var toSave = new ArrayList<FavoriteSpot>();

        for (int i = 0; i < usernames.size(); i++) {
            String username = usernames.get(i);

            var user = userEntityRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalStateException("Brak użytkownika w DB: " + username));

            int base = Math.floorMod(i * totalPerUser, allSpots.size());

            var favSpots      = pick(allSpots, base + 0 * perList, perList);
            var planSpots     = pick(allSpots, base + 1 * perList, perList);
            var likedSpots    = pick(allSpots, base + 2 * perList, perList);
            var notLikedSpots = pick(allSpots, base + 3 * perList, perList);

            for (var spot : favSpots) {
                toSave.add(FavoriteSpot.builder()
                        .spot(spot)
                        .user(user)
                        .type(FavoriteSpotsListType.FAVORITE)
                        .build());
            }

            for (var spot : planSpots) {
                toSave.add(FavoriteSpot.builder()
                        .spot(spot)
                        .user(user)
                        .type(FavoriteSpotsListType.PLAN_TO_VISIT)
                        .build());
            }

            for (var spot : likedSpots) {
                toSave.add(FavoriteSpot.builder()
                        .spot(spot)
                        .user(user)
                        .type(FavoriteSpotsListType.VISITED_LIKED_IT)
                        .build());
            }

            for (var spot : notLikedSpots) {
                toSave.add(FavoriteSpot.builder()
                        .spot(spot)
                        .user(user)
                        .type(FavoriteSpotsListType.VISITED_NOT_LIKED_IT)
                        .build());
            }
        }

        favoriteSpotRepository.saveAll(toSave);
    }

    private <T> List<T> pick(List<T> list, int start, int count) {
        int size = list.size();
        int n = Math.min(count, size);
        var result = new ArrayList<T>(n);
        for (int i = 0; i < n; i++) {
            result.add(list.get(Math.floorMod(start + i, size)));
        }
        return result;
    }
}
