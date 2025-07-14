package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FavoriteSpotNotExistException;
import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteSpotServiceTest {

    @Mock
    private FavoriteSpotRepository favoriteSpotRepository;

    @InjectMocks
    private FavoriteSpotService favoriteSpotService;

    @Test
    void shouldReturnAllUserFavoritesSpots() {
        var user = UserEntity.builder().username("user1").build();
        var spot1 = Spot.builder().name("testSpot1").build();
        var spot2 = Spot.builder().name("testSpot2").build();

        var favoriteSpot = FavoriteSpot.builder().user(user).spot(spot1).type(FavoriteSpotsListType.FAVORITE).build();
        var favoriteSpot2 = FavoriteSpot.builder().user(user).spot(spot2).type(FavoriteSpotsListType.FAVORITE).build();

        var favoriteSpotList = List.of(favoriteSpot, favoriteSpot2);

        when(favoriteSpotRepository.findAllByUserUsername(user.getUsername())).thenReturn(Optional.of(favoriteSpotList));

        var result = favoriteSpotService.getUserFavoritesSpots(user.getUsername(), FavoriteSpotsListType.ALL);

        assertAll(() -> assertEquals(2, result.size()),
                () -> assertFalse(result.isEmpty()),
                () -> assertEquals("testSpot1", result.getFirst().name()),
                () -> assertEquals("testSpot2", result.get(1).name()));
    }

    @Test
    void shouldReturnAllUserFavoritesSpotsWithPlanToVisitType() {
        var user = UserEntity.builder().username("user1").build();
        var spot1 = Spot.builder().name("testSpot1").build();

        var favoriteSpot = FavoriteSpot.builder().user(user).spot(spot1).type(FavoriteSpotsListType.PLAN_TO_VISIT).build();

        var favoriteSpotList = List.of(favoriteSpot);

        when(favoriteSpotRepository
                .findAllByUserUsernameAndType(user.getUsername(), FavoriteSpotsListType.PLAN_TO_VISIT))
                .thenReturn(Optional.of(favoriteSpotList));

        var result = favoriteSpotService.getUserFavoritesSpots(user.getUsername(), FavoriteSpotsListType.PLAN_TO_VISIT);

        assertAll(() -> assertEquals(1, result.size()),
                () -> assertFalse(result.isEmpty()),
                () -> assertEquals("testSpot1", result.getFirst().name()));
    }

    @Test
    void shouldRemoveSpotFromUserList() throws FavoriteSpotNotExistException {
        var username = "user1";
        var spotId = 42L;
        var type = FavoriteSpotsListType.PLAN_TO_VISIT;

        when(favoriteSpotRepository.removeFavoriteSpotByUserUsernameAndTypeAndSpotId(username, type, spotId)).thenReturn(1);

        favoriteSpotService.removeFavoriteSpot(username, type, spotId);

        verify(favoriteSpotRepository).removeFavoriteSpotByUserUsernameAndTypeAndSpotId(username, type, spotId);
    }

    @Test
    void shouldThrowFavoriteSpotNotExistExceptionWhenSpotInNotExist() {
        assertThrows(FavoriteSpotNotExistException.class,
                () -> favoriteSpotService.removeFavoriteSpot("user1", FavoriteSpotsListType.FAVORITE, 43L));
    }
}
