package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.NearbySpotDto;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.mappers.spot.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.utils.MapDistanceCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final static double DISTANCE_MARGIN_ACCEPTANCE_PERCENTAGE = 1.02;
    private final SpotRepository spotRepository;

    private List<GeneralSpotDto> getAllSpots() throws SpotsNotFoundException {
        var allSpots = spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }

        return allSpots;
    }

    private Pageable configurePageableSorting(Pageable pageable, String sorting) {
        Sort customSort = switch (sorting) {
            case "byRatingCountDesc" -> Sort.by("ratingCount").descending();
            case "byRatingCountAsc" -> Sort.by("ratingCount").ascending();
            case "byRatingDesc" -> Sort.by("rating").descending();
            case "byRatingAsc" -> Sort.by("rating").ascending();
            default -> pageable.getSort();
        };

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), customSort);
    }

    public Page<NearbySpotDto> getNearbySpots(String name, String sort, double ratingFrom, double ratingTo, double userLongitude, double userLatitude, double requiredMinDistance, Pageable pageable) {
        var sortedPageable = configurePageableSorting(pageable, sort);
        Page<Spot> nearbySpots = spotRepository.findAllByNameContainingIgnoreCaseAndRatingBetween(name, ratingFrom, ratingTo, sortedPageable);
        var nearbySpotsInDistance = nearbySpots
                .map(spot -> SpotMapper.toNearbySpotDto(spot, MapDistanceCalculator.calculateDistance(userLatitude, userLongitude, spot.getCenterPoint().getX(), spot.getCenterPoint().getY())))
                .filter(nearbySpotDto -> nearbySpotDto.distance() * DISTANCE_MARGIN_ACCEPTANCE_PERCENTAGE <= requiredMinDistance)
                .toList();
        return new PageImpl<>(nearbySpotsInDistance, sortedPageable, nearbySpotsInDistance.size());
    }

    public Page<SearchSpotDto> getSearchedSpotsListPage(String name, String sort, Pageable pageable) {
        Page<Spot> searchedSpotsPage = spotRepository.findAllByNameContainingIgnoreCase(name.trim(), configurePageableSorting(pageable, sort));
        return searchedSpotsPage.map(SpotMapper::toSearchSpotDto);
    }

    public SpotDetailsDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findByIdWithTags(id).map(SpotMapper::toDetailsDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    @Cacheable(value = "filteredSpots", key = "{#name}", unless = "#result == null")
    public List<GeneralSpotDto> getSearchedSpotsOnMap(String name) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();
        var filteredSpots = allSpots.stream()
                .filter(spot -> (name.isBlank() || spot.name().toLowerCase().contains(name.trim().toLowerCase())))
                .toList();
        if (filteredSpots.isEmpty()) {
            throw new SpotsNotFoundException("No spots match filters!");
        }

        return filteredSpots;
    }

    @Cacheable(value = "filteredSpotsNames", key = "#text", unless = "#result == null")
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
}
