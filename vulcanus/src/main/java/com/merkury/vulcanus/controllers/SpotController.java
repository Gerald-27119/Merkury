package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.features.spot.SpotWeatherService;
import com.merkury.vulcanus.model.dtos.spot.*;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotMediaGalleryDto;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotMediaGalleryPagePosition;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotSidebarMediaGalleryDto;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.SpotRatingFilterType;
import com.merkury.vulcanus.model.enums.SpotSortType;
import com.merkury.vulcanus.model.dtos.spot.weather.BasicSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.DetailedSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherTimelinePlotDataDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherWindSpeedsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SpotController {

    private static final int DEFAULT_SEARCHED_SPOTS_PAGE_SIZE = 6;

    private final SpotService spotService;

    private final SpotWeatherService spotWeatherService;

    @GetMapping("/public/spot/gallery")
    public ResponseEntity<Page<SpotSidebarMediaGalleryDto>> getSpotGalleryPage(@RequestParam Long spotId,
                                                                               @RequestParam String mediaType,
                                                                               @RequestParam String sorting,
                                                                               @RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "6") int size) {
        log.debug("get spot gallery page");
        return ResponseEntity.ok(spotService.getSpotGalleryPage(spotId, GenericMediaType.valueOf(mediaType), sorting, PageRequest.of(page, size)));
    }

    @GetMapping("/public/spot/gallery-media-position")
    public ResponseEntity<SpotMediaGalleryPagePosition> getSpotGalleryMediaPosition(@RequestParam Long spotId,
                                                                                    @RequestParam Long mediaId,
                                                                                    @RequestParam String mediaType,
                                                                                    @RequestParam String sorting,
                                                                                    @RequestParam(defaultValue = "6") int pageSize) throws SpotMediaNotFoundException {
        log.debug("get spot gallery media position");
        return ResponseEntity.ok(spotService.getSpotGalleryMediaPosition(spotId, mediaId, GenericMediaType.valueOf(mediaType), sorting, pageSize));
    }

    @GetMapping("/public/spot/gallery-fullscreen-media")
    public ResponseEntity<SpotMediaGalleryDto> getSpotGalleryFullscreenMedia(@RequestParam Long spotId, @RequestParam Long mediaId, @RequestParam String mediaType) throws SpotMediaNotFoundException {
        log.debug("get spot gallery fullscreen media");
        return ResponseEntity.ok(spotService.getMediaForFullscreen(spotId, mediaId, GenericMediaType.valueOf(mediaType)));
    }

    @GetMapping("/public/spot/current-view")
    public ResponseEntity<Page<SearchSpotDto>> getCurrentView(@RequestParam double swLng,
                                                              @RequestParam double swLat,
                                                              @RequestParam double neLng,
                                                              @RequestParam double neLat,
                                                              @RequestParam(defaultValue = "") String name,
                                                              @RequestParam(defaultValue = "none") String sorting,
                                                              @RequestParam(defaultValue = "0.0") double ratingFrom,
                                                              @RequestParam(defaultValue = "0") int page) {
        log.debug("getting spots in current view");
        return ResponseEntity.ok(spotService.getSpotsInCurrentView(swLng, swLat, neLng, neLat, name, sorting, ratingFrom, PageRequest.of(page, DEFAULT_SEARCHED_SPOTS_PAGE_SIZE)));
    }

    @GetMapping("/public/spot/current-view/spot-names")
    public ResponseEntity<List<String>> getSpotNamesInCurrentView(@RequestParam double swLng,
                                                                  @RequestParam double swLat,
                                                                  @RequestParam double neLng,
                                                                  @RequestParam double neLat,
                                                                  @RequestParam(defaultValue = "") String name) {
        log.debug("getting spots names in current view");
        return ResponseEntity.ok(spotService.getSpotsNamesInCurrentView(swLng, swLat, neLng, neLat, name));
    }

    @GetMapping("/public/spot/{spotId}")
    public ResponseEntity<SpotDetailsDto> getSpotById(@PathVariable Long spotId) throws SpotNotFoundException {
        log.debug("getting spot with id: {}", spotId);
        return ResponseEntity.ok(spotService.getSpotById(spotId));
    }

    @PatchMapping("/public/spot/increase-view-count")
    public ResponseEntity<Void> increaseSpotViewsCount(@RequestParam long spotId) throws SpotNotFoundException {
        log.debug("Increase spot views count: {}", spotId);
        spotService.increaseSpotViewsCount(spotId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public/spot/search/map")
    public ResponseEntity<List<GeneralSpotDto>> getSearchedSpotsOnMap(
            @RequestParam(defaultValue = "") String name) throws SpotsNotFoundException {
        log.debug("getting searched spots on map");
        return ResponseEntity.ok(spotService.getSearchedSpotsOnMap(name));
    }

    @GetMapping("/public/spot/search/list")
    public ResponseEntity<Page<SearchSpotDto>> getSearchedSpotsListPage(@RequestParam(defaultValue = "") String name,
                                                                        @RequestParam(defaultValue = "none") String sorting,
                                                                        @RequestParam(defaultValue = "0") int page) {
        log.debug("getting searched spots to list");
        return ResponseEntity.ok(spotService.getSearchedSpotsListPage(name, sorting, PageRequest.of(page, DEFAULT_SEARCHED_SPOTS_PAGE_SIZE)));
    }

    @GetMapping("/public/spot/names")
    public ResponseEntity<List<String>> getFilteredSpotsNames(@RequestParam(defaultValue = "") String text) throws SpotsNotFoundException {
        log.debug("getting spots names");
        return ResponseEntity.ok(spotService.getFilteredSpotsNames(text));
    }

    @GetMapping("/public/spot/most-popular")
    public ResponseEntity<List<TopRatedSpotDto>> get18MostPopularSpots() {
        return ResponseEntity.ok(spotService.get18MostPopularSpots());
    }

    @GetMapping("/public/spot/search/home-page")
    public ResponseEntity<HomePageSpotPageDto> getSearchedSpotsOnHomePage(@RequestParam(required = false) String country,
                                                                          @RequestParam(required = false) String region,
                                                                          @RequestParam(required = false) String city,
                                                                          @RequestParam(required = false) Double userLongitude,
                                                                          @RequestParam(required = false) Double userLatitude,
                                                                          @RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(spotService.getAllSpotsByLocation(country, region, city, userLongitude, userLatitude, page, size));
    }

    @GetMapping("/public/spot/search/home-page/locations")
    public ResponseEntity<List<String>> getLocations(
            @RequestParam String query,
            @RequestParam String type) {
        return ResponseEntity.ok(spotService.getLocations(query, type));
    }

    @GetMapping("/public/spot/search/home-page/advance")
    public ResponseEntity<HomePageSpotPageDto> getSearchedSpotsOnHomePage(@RequestParam(required = false) String city,
                                                                          @RequestParam(required = false) List<String> tags,
                                                                          @RequestParam(required = false) Double userLongitude,
                                                                          @RequestParam(required = false) Double userLatitude,
                                                                          @RequestParam(required = false) SpotSortType sort,
                                                                          @RequestParam(required = false) SpotRatingFilterType filter,
                                                                          @RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "20") int size) {
        var request = new SpotSearchRequestDto(city, tags, sort, filter);
        return ResponseEntity.ok(spotService.getAllSpotsByLocationAndTags(request, userLongitude, userLatitude, page, size));
    }

    @GetMapping("/public/spot/get-spot-basic-weather")
    public ResponseEntity<Mono<BasicSpotWeatherDto>> getBasicSpotWeather(@RequestParam double latitude, @RequestParam double longitude) {
        log.debug("getting basic spot weather");
        return ResponseEntity.ok(spotWeatherService.getBasicSpotWeather(latitude, longitude));
    }

    @GetMapping("/public/spot/get-spot-detailed-weather")
    public ResponseEntity<Mono<DetailedSpotWeatherDto>> getDetailedSpotWeather(@RequestParam double latitude, @RequestParam double longitude) {
        log.debug("getting detailed spot weather");
        return ResponseEntity.ok(spotWeatherService.getDetailedSpotWeather(latitude, longitude));
    }

    @GetMapping("/public/spot/get-spot-wind-speeds")
    public ResponseEntity<Mono<SpotWeatherWindSpeedsDto>> getSpotWindSpeeds(@RequestParam double latitude, @RequestParam double longitude, @RequestParam long spotId) {
        log.debug("getting spot wind speeds");
        return ResponseEntity.ok(spotWeatherService.getSpotWeatherWindSpeeds(latitude, longitude, spotId));
    }

    @GetMapping("/public/spot/get-spot-weather-timeline-plot-data")
    public ResponseEntity<Mono<List<SpotWeatherTimelinePlotDataDto>>> getSpotWeatherTimelinePlotData(@RequestParam double latitude, @RequestParam double longitude, @RequestParam long spotId) {
        log.debug("getting spot weather timeline plot data");
        return ResponseEntity.ok(spotWeatherService.getSpotWeatherTimelinePlotData(latitude, longitude, spotId));
    }
}
