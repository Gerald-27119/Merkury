package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/spot")
@RequiredArgsConstructor
public class SpotController {

    private final SpotService spotService;

    @GetMapping("/{spotId}")
    public ResponseEntity<SpotDetailsDto> getSpotById(@PathVariable("spotId") Long id) throws SpotNotFoundException {
        log.info("getting spot with id: {}", id);
        return ResponseEntity.ok(spotService.getSpotById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<SpotDto>> getFilteredSpots(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Double minRating,
            @RequestParam(defaultValue = "5") Double maxRating) throws SpotsNotFoundException {
        log.info("getting filtered spots");
        return ResponseEntity.ok(spotService.getFilteredSpots(name, minRating, maxRating));
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getFilteredSpotsNames(@RequestParam(defaultValue = "") String text) throws SpotsNotFoundException {
        log.info("getting spots names");
        return ResponseEntity.ok(spotService.getFilteredSpotsNames(text));
    }
}
