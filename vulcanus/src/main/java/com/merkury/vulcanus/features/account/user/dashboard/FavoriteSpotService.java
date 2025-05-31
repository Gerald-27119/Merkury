package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.mappers.user.dashboard.FavoriteSpotMapper;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteSpotService {
    private final FavoriteSpotRepository favoriteSpotRepository;

    public List<FavoriteSpotDto> getAllUserFavoritesSpots(String username){
        return favoriteSpotRepository
                .findAllByUserUsername(username)
                .orElse(new ArrayList<>())
                .stream()
                .map(FavoriteSpotMapper::toDto)
                .toList();
    }
}
