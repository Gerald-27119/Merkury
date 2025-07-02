package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FavoriteSpotNotExistException;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.entities.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.mappers.user.dashboard.FavoriteSpotMapper;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteSpotService {
    private final FavoriteSpotRepository favoriteSpotRepository;

    public List<FavoriteSpotDto> getUserFavoritesSpots(String username, FavoriteSpotsListType type) {
        List<FavoriteSpot> favoriteSpots;

        if (type == FavoriteSpotsListType.ALL) {
            favoriteSpots = favoriteSpotRepository
                    .findAllByUserUsername(username)
                    .orElseGet(List::of);
        } else {
            favoriteSpots = favoriteSpotRepository
                    .findAllByUserUsernameAndType(username, type)
                    .orElseGet(List::of);
        }

        return favoriteSpots.stream()
                .map(FavoriteSpotMapper::toDto)
                .toList();
    }

    public void removeFavoriteSpot(String username, FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        var deleted = favoriteSpotRepository.removeFavoriteSpotByUserUsernameAndTypeAndSpotId(username, type, spotId);
        if (deleted != 1){
            throw new FavoriteSpotNotExistException();
        }
    }
}
