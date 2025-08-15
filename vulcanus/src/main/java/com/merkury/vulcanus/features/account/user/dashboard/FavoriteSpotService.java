package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FavoriteSpotNotExistException;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotPageDto;
import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.mappers.user.dashboard.FavoriteSpotMapper;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteSpotService {
    private final FavoriteSpotRepository favoriteSpotRepository;

    public FavoriteSpotPageDto getUserFavoritesSpots(String username, FavoriteSpotsListType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Slice<FavoriteSpot> favoriteSpots;

        if (type == FavoriteSpotsListType.ALL) {
            favoriteSpots = favoriteSpotRepository.findAllByUserUsername(username, pageable);
        } else {
            favoriteSpots = favoriteSpotRepository.findAllByUserUsernameAndType(username, type, pageable);
        }

        var mappedFavoriteSpots = favoriteSpots.stream()
                .map(FavoriteSpotMapper::toDto)
                .toList();

        return new FavoriteSpotPageDto(mappedFavoriteSpots, favoriteSpots.hasNext());
    }

    public void removeFavoriteSpot(String username, FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        var deleted = favoriteSpotRepository.removeFavoriteSpotByUserUsernameAndTypeAndSpotId(username, type, spotId);
        if (deleted != 1) {
            throw new FavoriteSpotNotExistException();
        }
    }
}
