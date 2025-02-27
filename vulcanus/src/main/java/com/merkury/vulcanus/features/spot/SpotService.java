package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotAlreadyFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.spot.FavouriteSpotDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.mappers.FavouriteSpotMapper;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final CommentService commentService;
    private final UserEntityRepository userEntityRepository;
    private final UserDataService userDataService;

    private List<GeneralSpotDto> getAllSpots() throws SpotsNotFoundException {
        var allSpots = spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }

        return allSpots;
    }

    public SpotDetailsDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findById(id).map(SpotMapper::toDetailsDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public void addComment(String text, Long spotId, HttpServletRequest request) throws SpotNotFoundException, UserNotFoundException {
        commentService.addComment(text, spotId, request);
    }

    public void editComment(Long commentId, String text, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        commentService.editComment(commentId, text, request);
    }

    public void deleteComment(Long commentId, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        commentService.deleteComment(commentId, request);
    }

    public Page<CommentDto> getCommentsPageBySpotId(Long spotId, int page, int size) throws SpotNotFoundException {
        return commentService.getCommentsPageBySpotId(spotId, page, size);
    }

//    @Cacheable(value = "filteredSpots", key = "{#name, #minRating, #maxRating}", unless = "#result == null")
    public List<GeneralSpotDto> getFilteredSpots(String name, Double minRating, Double maxRating) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();
        var filteredSpots = allSpots.stream()
                .filter(spot -> (name.isBlank() || spot.name().toLowerCase().contains(name.trim().toLowerCase())) &&
                        (minRating == null || spot.rating() >= minRating) &&
                        (maxRating == null || spot.rating() <= maxRating))
                .toList();
        if (filteredSpots.isEmpty()) {
            throw new SpotsNotFoundException("No spots match filters!");
        }

        return filteredSpots;
    }

//    @Cacheable(value = "filteredSpotsNames", key = "#text", unless = "#result == null")
    public List<String> getFilteredSpotsNames(String text) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();

        var spotsNames = allSpots.stream()
                .map(GeneralSpotDto::name)
                .filter(spotName -> spotName.toLowerCase().contains(text.trim().toLowerCase()))
                .toList();

        if (spotsNames.isEmpty()) {
            throw new SpotsNotFoundException("No spot names found!");
        }

        return spotsNames;
    }

    public Page<FavouriteSpotDto> getUserFavouriteSpots(HttpServletRequest request, Pageable pageable) {
        var user = userDataService.getUserFromRequest(request);
        Page<Spot> favouriteSpotsPage = userEntityRepository.findPagedFavouriteSpotsByUserId(user.getId(), pageable);

        return favouriteSpotsPage.map(FavouriteSpotMapper::toDto);
    }

    public void addSpotToFavourites(HttpServletRequest request, Long spotId) throws SpotNotFoundException, SpotAlreadyFavouriteException {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (user.getFavoriteSpots().contains(spot)) {
            throw new SpotAlreadyFavouriteException();
        }
        user.getFavoriteSpots().add(spot);
        userEntityRepository.save(user);
    }

    public void removeSpotFromFavourites(HttpServletRequest request, Long spotId) throws SpotNotFoundException, SpotNotFavouriteException {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        if (!user.getFavoriteSpots().contains(spot)) {
            throw new SpotNotFavouriteException();
        }
        user.getFavoriteSpots().remove(spot);
        userEntityRepository.save(user);
    }

    public Boolean isSpotFavourite(HttpServletRequest request, Long spotId) throws SpotNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var spot = getSpotByIdOrThrow(spotId);

        return user.getFavoriteSpots().contains(spot);
    }

    private Spot getSpotByIdOrThrow(Long spotId) throws SpotNotFoundException {
        return spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
    }
}
