package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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

    public List<SpotDto> getUserFavouriteSpots(HttpServletRequest request) {
        var user = userDataService.getUserFromRequest(request);
        return user.getFavoriteSpots().stream().map(SpotMapper::toDto).toList();
    }

    public void addSpotToFavourites(HttpServletRequest request, Long spotId) {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (user.getFavoriteSpots().contains(spot)) {
            throw new IllegalStateException("Spot is already in the user's favourites");
        }

        user.getFavoriteSpots().add(spot);
        userEntityRepository.save(user);
    }

    public void removeSpotFromFavourites(HttpServletRequest request, Long spotId) {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (!user.getFavoriteSpots().contains(spot)) {
            throw new IllegalStateException("Spot is not in the user's favourites");
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
        return spotRepository.findById(spotId)
                .orElseThrow(() -> new SpotNotFoundException(spotId));
    }
}
