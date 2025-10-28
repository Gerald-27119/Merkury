package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.SpotMediaNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.dtos.spot.*;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotMediaGalleryDto;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotMediaGalleryPagePosition;
import com.merkury.vulcanus.model.dtos.spot.gallery.SpotSidebarMediaGalleryDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.entities.spot.SpotTag;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.interfaces.ISpotNameOnly;
import com.merkury.vulcanus.model.interfaces.CityView;
import com.merkury.vulcanus.model.interfaces.CountryView;
import com.merkury.vulcanus.model.interfaces.RegionView;
import com.merkury.vulcanus.model.mappers.spot.SpotMapper;
import com.merkury.vulcanus.model.mappers.spot.SpotMediaMapper;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.specification.SpotSpecification;
import com.merkury.vulcanus.utils.MapDistanceCalculator;
import com.merkury.vulcanus.model.repositories.SpotTagRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final SpotTagRepository spotTagRepository;
    private final SpotMediaRepository spotMediaRepository;
    private final AzureBlobService azureBlobService;
    private final UserEntityFetcher userEntityFetcher;

    private Pageable configurePageableSorting(Pageable pageable, String sorting) {
        Sort customSort = switch (sorting) {
            case "byRatingCountDesc" -> Sort.by("ratingCount").descending();
            case "byRatingCountAsc" -> Sort.by("ratingCount").ascending();
            case "byRatingDesc" -> Sort.by("rating").descending();
            case "byRatingAsc" -> Sort.by("rating").ascending();
            case "newest" -> Sort.by("addDate").descending();
            case "oldest" -> Sort.by("addDate").ascending();
            case "mostLiked" -> Sort.by("likes").descending();
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

    public List<TopRatedSpotDto> get18MostPopularSpots() {
        return spotRepository
                .findTop18ByOrderByRatingDescViewsCountDesc()
                .stream()
                .map(SpotMapper::toTopRated)
                .toList();
    }

    public HomePageSpotPageDto getAllSpotsByLocation(String country, String region, String city, Double userLongitude, Double userLatitude, int page, int size) {
        var spec = Specification
                .where(SpotSpecification.hasCountry(country))
                .and(SpotSpecification.hasRegion(region))
                .and(SpotSpecification.hasCity(city));

        Pageable pageable = PageRequest.of(page, size);

        Slice<Spot> spotPages = spotRepository.findAll(spec, pageable);

        var spotDtos = spotPages.stream()
                .map(spot -> {
                    Double userDistanceToSpot = null;

                    if (userLatitude != null && userLongitude != null) {
                        userDistanceToSpot = MapDistanceCalculator.calculateDistance(
                                userLatitude,
                                userLongitude,
                                spot.getCenterPoint().getX(),
                                spot.getCenterPoint().getY()
                        );
                    }

                    return SpotMapper.toHomePageSearchSpotDto(spot, userDistanceToSpot);
                })
                .toList();

        return new HomePageSpotPageDto(spotDtos, spotPages.hasNext());
    }

    public List<String> getLocations(String query, String type) {
        if ("tags".equalsIgnoreCase(type) && (query == null || query.isBlank())) {
            return spotTagRepository.findAll().stream().map(SpotTag::getName).toList();
        }

        if (query == null || query.length() < 2 || type == null) {
            return Collections.emptyList();
        }

        return switch (type.toLowerCase()) {
            case "country" -> spotRepository.findDistinctByCountryStartingWithIgnoreCase(query)
                    .stream().map(CountryView::getCountry).toList();
            case "region" -> spotRepository.findDistinctByRegionStartingWithIgnoreCase(query)
                    .stream().map(RegionView::getRegion).toList();
            default -> spotRepository.findDistinctByCityStartingWithIgnoreCase(query)
                    .stream().map(CityView::getCity).toList();
        };
    }

    public HomePageSpotPageDto getAllSpotsByLocationAndTags(SpotSearchRequestDto request, Double userLongitude, Double userLatitude, int page, int size) {
        var spec = Specification.<Spot>where(null)
                .and(SpotSpecification.hasCity(request.city()))
                .and(SpotSpecification.hasAnyTag(request.tags()))
                .and(SpotSpecification.hasMinRating(request.filter()));

        Sort sort = Sort.unsorted();
        if (request.sort() != null) {
            switch (request.sort()) {
                case POPULARITY_DESCENDING -> sort = Sort.by(Sort.Direction.DESC, "viewsCount");
                case POPULARITY_ASCENDING -> sort = Sort.by(Sort.Direction.ASC, "viewsCount");
                case RATING_DESCENDING -> sort = Sort.by(Sort.Direction.DESC, "rating");
                case RATING_ASCENDING -> sort = Sort.by(Sort.Direction.ASC, "rating");
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Slice<Spot> spotPages = spotRepository.findAll(spec, pageable);

        var spotDtos = spotPages.stream()
                .map(spot -> {
                    Double userDistanceToSpot = null;

                    if (userLatitude != null && userLongitude != null) {
                        userDistanceToSpot = MapDistanceCalculator.calculateDistance(
                                userLatitude,
                                userLongitude,
                                spot.getCenterPoint().getX(),
                                spot.getCenterPoint().getY()
                        );
                    }

                    return SpotMapper.toHomePageSearchSpotDto(spot, userDistanceToSpot);
                })
                .toList();

        return new HomePageSpotPageDto(spotDtos, spotPages.hasNext());
    }

    public SpotMediaGalleryPagePosition getSpotGalleryMediaPosition(
            Long spotId, Long mediaId, GenericMediaType mediaType, String sorting, int pageSize) throws SpotMediaNotFoundException {
        int pos = spotMediaRepository.findPositionForMedia(mediaId, spotId, mediaType.toString(), sorting).orElseThrow(() -> new SpotMediaNotFoundException(spotId, mediaId, mediaType));
        int pageNumber = pos / pageSize;
        return SpotMediaGalleryPagePosition.builder()
                .mediaPagePosition(pageNumber)
                .build();
    }

    public Page<SpotSidebarMediaGalleryDto> getSpotGalleryPage(Long spotId, GenericMediaType mediaType, String sorting, Pageable pageable) {
        var sortedPageable = configurePageableSorting(pageable, sorting);
        return spotMediaRepository.findBySpotIdAndGenericMediaType(spotId, mediaType, sortedPageable).map(SpotMediaMapper::toSidebarGalleryDto);
    }

    public SpotMediaGalleryDto getMediaForFullscreen(Long spotId, Long mediaId, GenericMediaType mediaType) throws SpotMediaNotFoundException {
        var media = spotMediaRepository.findByIdAndSpotIdAndGenericMediaType(mediaId, spotId, mediaType)
                .orElseThrow(() -> new SpotMediaNotFoundException(spotId, mediaId, mediaType));
        return SpotMediaMapper.toGalleryDto(media);
    }

    public void addMediaToSpot(List<MultipartFile> mediaFiles, long spotId, String username) throws UserNotFoundByUsernameException, InvalidFileTypeException, BlobContainerNotFoundException, IOException, SpotNotFoundException {
        var author = userEntityFetcher.getByUsername(username);
        var spot = spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
        List<SpotMedia> entities = new ArrayList<>();
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                String blobUrl = azureBlobService.upload("mapa", file, AzureBlobFileValidatorType.DEFAULT);

                SpotMedia mediaEntity = SpotMedia.builder()
                        .url(blobUrl)
                        .alt(file.getOriginalFilename())
                        .description("")
                        .genericMediaType(getMediaType(file))
                        .author(author)
                        .spot(spot)
                        .build();
                entities.add(mediaEntity);
            }
        }
        spotMediaRepository.saveAll(entities);
    }

    private GenericMediaType getMediaType(MultipartFile file) {
        var contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("image")) return GenericMediaType.PHOTO;
        return GenericMediaType.VIDEO;
    }
}
