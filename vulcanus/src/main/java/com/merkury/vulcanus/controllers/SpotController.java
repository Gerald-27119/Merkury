package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.SpotDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/spot")
@RequiredArgsConstructor
public class SpotController {

    private final SpotService spotService;

    @GetMapping("")
    public ResponseEntity<List<SpotDto>> getAllSpots() {
        return ResponseEntity.ok(spotService.getAllSpots());
    }

    @GetMapping("/{spotId}")
    public ResponseEntity<SpotDto> getSpotById(@PathVariable("spotId") Long id) throws SpotNotFoundException {
        return ResponseEntity.ok(spotService.getSpotById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<SpotDto>> getFilteredSpots(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Double minRating,
            @RequestParam(defaultValue = "5") Double maxRating) throws SpotsNotFoundException {
        return ResponseEntity.ok(spotService.getFilteredSpots(name, minRating, maxRating));
    }

}
