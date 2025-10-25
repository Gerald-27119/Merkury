package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FavoriteSpotNotExistException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotPageDto;
import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.mappers.user.dashboard.FavoriteSpotMapper;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteSpotService {
    private final FavoriteSpotRepository favoriteSpotRepository;
    private final UserEntityRepository userEntityRepository;
    private final SpotRepository spotRepository;

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

    public void addFavouriteSpot(String username, FavoriteSpotsListType type, Long spotId) throws UserNotFoundException, SpotNotFoundException {
        var favoriteSpot = new FavoriteSpot();
        var user = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with username %s not found", username)));
        var spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new SpotNotFoundException(spotId));

        favoriteSpot.setType(type);
        favoriteSpot.setUser(user);
        favoriteSpot.setSpot(spot);
        favoriteSpotRepository.save(favoriteSpot);
    }

    public void removeFavoriteSpot(String username, FavoriteSpotsListType type, Long spotId) throws FavoriteSpotNotExistException {
        var deleted = favoriteSpotRepository.removeFavoriteSpotByUserUsernameAndTypeAndSpotId(username, type, spotId);
        if (deleted != 1) {
            throw new FavoriteSpotNotExistException();
        }
    }

    public boolean isSpotInUserFavoriteSpots(String username, Long spotId) {
        return favoriteSpotRepository.existsByUserUsernameAndSpotIdAndType(username, spotId, FavoriteSpotsListType.FAVORITE);
    }
}
