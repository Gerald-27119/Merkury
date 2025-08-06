package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.interfaces.ISpotNameOnly;
import com.merkury.vulcanus.model.mappers.spot.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;

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

    public Page<SearchSpotDto> getSpotsInCurrentView(double swLng, double swLat, double neLng, double neLat, String name, String sort, double ratingFrom, Pageable pageable) {
        var sortedPageable = configurePageableSorting(pageable, sort);
        return spotRepository.findByNameContainingIgnoreCaseAndRatingGreaterThanEqualAndCenterPointXBetweenAndCenterPointYBetween(name, ratingFrom, swLat, neLat, swLng, neLng, sortedPageable)
                .map(SpotMapper::toSearchSpotDto);
    }

    public List<String> getSpotsNamesInCurrentView(double swLng, double swLat, double neLng, double neLat, String name) {
        return spotRepository.findByNameContainingIgnoreCaseAndCenterPointXBetweenAndCenterPointYBetween(name, swLat, neLat, swLng, neLng).stream()
                .map(ISpotNameOnly::getName)
                .toList();
    }

    public Page<SearchSpotDto> getSearchedSpotsListPage(String name, String sort, Pageable pageable) {
        Page<Spot> searchedSpotsPage = spotRepository.findAllByNameContainingIgnoreCase(name.trim(), configurePageableSorting(pageable, sort));
        return searchedSpotsPage.map(SpotMapper::toSearchSpotDto);
    }

    public SpotDetailsDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findByIdWithTags(id).map(SpotMapper::toDetailsDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    @Cacheable(
            value = "filteredSpots",
            key = "#name",
            condition = "#name != null && #name.trim().length() > 0",
            unless = "#result == null || #result.isEmpty()"
    )
    public List<GeneralSpotDto> getSearchedSpotsOnMap(String name) throws SpotsNotFoundException {
        String trimmed = !StringUtils.hasText(name) ? "" : name.trim();

        List<Spot> spots;
        if (trimmed.isEmpty()) {
            spots = spotRepository.findAll();
        } else {
            spots = spotRepository.findAllByNameContainingIgnoreCase(trimmed);
        }

        List<GeneralSpotDto> filteredSpots = spots.stream()
                .map(SpotMapper::toDto)
                .toList();

        if (filteredSpots.isEmpty()) {
            throw new SpotsNotFoundException("No spots match filters!");
        }

        return filteredSpots;
    }

    @Cacheable(value = "filteredSpotsNames", key = "#text", unless = "#result == null")
    public List<String> getFilteredSpotsNames(String text) throws SpotsNotFoundException {

        var spotsNames = spotRepository.findByNameContainingIgnoreCase(text).stream()
                .map(ISpotNameOnly::getName)
                .toList();

        if (spotsNames.isEmpty()) {
            throw new SpotsNotFoundException("No spot names found!");
        }

        return spotsNames;
    }
}
