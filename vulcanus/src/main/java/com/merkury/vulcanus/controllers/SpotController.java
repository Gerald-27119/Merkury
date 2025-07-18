package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SpotController {

    private final static int DEFAULT_SEARCHED_SPOTS_PAGE_SIZE = 6;

    private final SpotService spotService;

    @GetMapping("/public/spot/current-view")
    public ResponseEntity<Page<SearchSpotDto>> getCurrentView(@RequestParam double swLng,
                                                              @RequestParam double swLat,
                                                              @RequestParam double neLng,
                                                              @RequestParam double neLat,
                                                              @RequestParam(defaultValue = "") String name,
                                                              @RequestParam(defaultValue = "none") String sorting,
                                                              @RequestParam(defaultValue = "0.0") double ratingFrom,
                                                              @RequestParam(defaultValue = "0") int page) {
        log.info("getting spots in current view");
        return ResponseEntity.ok(spotService.getSpotsInCurrentView(swLng, swLat, neLng, neLat, name, sorting, ratingFrom, PageRequest.of(page, DEFAULT_SEARCHED_SPOTS_PAGE_SIZE)));
    }

    @GetMapping("/public/spot/current-view/spot-names")
    public ResponseEntity<List<String>> getSpotNamesInCurrentView(@RequestParam double swLng,
                                                                  @RequestParam double swLat,
                                                                  @RequestParam double neLng,
                                                                  @RequestParam double neLat,
                                                                  @RequestParam(defaultValue = "") String name) {
        log.info("getting spots names in current view");
        return ResponseEntity.ok(spotService.getSpotsNamesInCurrentView(swLng, swLat, neLng, neLat, name));
    }

    @GetMapping("/public/spot/{spotId}")
    public ResponseEntity<SpotDetailsDto> getSpotById(@PathVariable Long spotId) throws SpotNotFoundException {
        log.info("getting spot with id: {}", spotId);
        return ResponseEntity.ok(spotService.getSpotById(spotId));
    }

    @GetMapping("/public/spot/search/map")
    public ResponseEntity<List<GeneralSpotDto>> getSearchedSpotsOnMap(
            @RequestParam(defaultValue = "") String name) throws SpotsNotFoundException {
        log.info("getting searched spots on map");
        return ResponseEntity.ok(spotService.getSearchedSpotsOnMap(name));
    }

    @GetMapping("/public/spot/search/list")
    public ResponseEntity<Page<SearchSpotDto>> getSearchedSpotsListPage(@RequestParam(defaultValue = "") String name,
                                                                        @RequestParam(defaultValue = "none") String sorting,
                                                                        @RequestParam(defaultValue = "0") int page) {
        log.info("getting searched spots to list");
        return ResponseEntity.ok(spotService.getSearchedSpotsListPage(name, sorting, PageRequest.of(page, DEFAULT_SEARCHED_SPOTS_PAGE_SIZE)));
    }

    @GetMapping("/public/spot/names")
    public ResponseEntity<List<String>> getFilteredSpotsNames(@RequestParam(defaultValue = "") String text) throws SpotsNotFoundException {
        log.info("getting spots names");
        return ResponseEntity.ok(spotService.getFilteredSpotsNames(text));
    }
}
