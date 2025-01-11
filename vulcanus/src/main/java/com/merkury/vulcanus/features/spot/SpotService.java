package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;

    public List<SpotDto> getAllSpots() {
        return spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
    }

    public SpotDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public List<SpotDto> getFilteredSpots(String name, Double minRating, Double maxRating) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }
        log.info("name: {}", name);
        log.info("min: {}", minRating);
        log.info("max: {}", maxRating);
        var filteredSpots = allSpots.stream()
                .filter(spot -> (name.isBlank() || spot.getName().toLowerCase().contains(name.trim().toLowerCase())) &&
                        (minRating == null || spot.getRating() >= minRating) &&
                        (maxRating == null || spot.getRating() <= maxRating))
                .toList();
        if (filteredSpots.isEmpty()) {
            throw new SpotsNotFoundException("No spots match filters!");
        }

        return filteredSpots;
    }

    public List<String> getSpotsNames() throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }

        var spotsNames = allSpots.stream().map(SpotDto::getName).toList();

        if (spotsNames.isEmpty()) {
            throw new SpotsNotFoundException("No spot names found!");
        }

        return spotsNames;
    }
}
