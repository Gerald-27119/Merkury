package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.mappers.spot.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;

    private List<GeneralSpotDto> getAllSpots() throws SpotsNotFoundException {
        var allSpots = spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }

        return allSpots;
    }

    public Page<SearchSpotDto> getSearchedSpotsListPage(String name, String sort, Pageable pageable) {
        Sort customSort = switch (sort) {
            case "byRatingCountDesc" -> Sort.by("ratingCount").descending();
            case "byRatingCountAsc" -> Sort.by("ratingCount").ascending();
            case "byRatingDesc" -> Sort.by("rating").descending();
            case "byRatingAsc" -> Sort.by("rating").ascending();
            default -> pageable.getSort();
        };
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                customSort
        );
        Page<Spot> searchedSpotsPage = spotRepository.findAllByNameContainingIgnoreCase(name.trim(), sortedPageable);
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
