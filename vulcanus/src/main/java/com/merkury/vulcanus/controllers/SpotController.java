package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.SpotDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<SpotDto> getSpotById(@PathVariable("spotId") Long id) {
        return ResponseEntity.ok(spotService.getSpotById(id));
    }

    @GetMapping("/favourites")
    public ResponseEntity<List<SpotDto>> getUserFavouriteSpots(HttpServletRequest request) {
        spotService.getUserFavouriteSpots(request);
        return ResponseEntity.ok(spotService.getUserFavouriteSpots(request));
    }

    @PutMapping("/favourites/add")
    public ResponseEntity<String> addSpotToFavourites(HttpServletRequest request, @RequestParam Long spotId) {
        spotService.addSpotToFavourites(request, spotId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/favourites/remove")
    public ResponseEntity<String> removeSpotFromFavourites(HttpServletRequest request, @RequestParam Long spotId) {
        spotService.removeSpotFromFavourites(request, spotId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/favourites/check")
    public ResponseEntity<Boolean> isSpotFavourite(HttpServletRequest request, @RequestParam Long spotId) {
        return ResponseEntity.ok(spotService.isSpotFavourite(request, spotId));
    }
}
