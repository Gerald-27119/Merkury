package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotAlreadyFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.FavouriteSpotDto;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.mappers.FavouriteSpotMapper;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final UserEntityRepository userEntityRepository;
    private final UserDataService userDataService;

    public List<SpotDto> getAllSpots() {
        return spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
    }

    public SpotDto getSpotById(Long id) {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public Page<FavouriteSpotDto> getUserFavouriteSpots(HttpServletRequest request, Pageable pageable) {
        var user = userDataService.getUserFromRequest(request);
        Page<Spot> favouriteSpotsPage = userEntityRepository.findPagedFavouriteSpotsByUserId(user.getId(), pageable);

        return favouriteSpotsPage.map(FavouriteSpotMapper::toDto);
    }

    public void addSpotToFavourites(HttpServletRequest request, Long spotId) {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (user.getFavoriteSpots().contains(spot)) {
            throw new SpotAlreadyFavouriteException();
        }
        user.getFavoriteSpots().add(spot);
        userEntityRepository.save(user);
    }

    public void removeSpotFromFavourites(HttpServletRequest request, Long spotId) {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (!user.getFavoriteSpots().contains(spot)) {
            throw new SpotNotFavouriteException();
        }
        user.getFavoriteSpots().remove(spot);
        userEntityRepository.save(user);
    }

    public Boolean isSpotFavourite(HttpServletRequest request, Long spotId){
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        return user.getFavoriteSpots().contains(spot);
    }

    private Spot getSpotByIdOrThrow(Long spotId) {
        return spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
    }
}
