package com.merkury.vulcanus.controllers.spot;

import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.repositories.FavoriteSpotRepository;
import com.merkury.vulcanus.model.entities.spot.SpotTag;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.SpotTagRepository;
import com.merkury.vulcanus.utils.PolygonCenterPointCalculator;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
class SpotControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SpotRepository spotRepository;

    @Autowired
    private SpotTagRepository spotTagRepository;

    @Autowired
    private FavoriteSpotRepository favoriteSpotRepository;

    private static final int REDIS_PORT = 6379;
    private static final String REDIS_IMAGE_NAME = "redis:6-alpine";

    @Container
    public static GenericContainer<?> redis = new GenericContainer<>(DockerImageName.parse(REDIS_IMAGE_NAME))
            .withExposedPorts(REDIS_PORT);

    @DynamicPropertySource
    static void setRedisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(REDIS_PORT));
    }

    @BeforeEach
    void setUp() {
        var borderPoints = List.of(
                new BorderPoint(40.785091, -73.968285),
                new BorderPoint(40.784091, -73.969285)
        );

        var spot3BorderPoints = List.of(
                new BorderPoint(40.783000, -73.970000),
                new BorderPoint(40.786000, -73.970500)
        );

        List<String> tagsNames = new ArrayList<>(List.of(
                "tag1",
                "tag2",
                "tag3"
        ));
        Set<SpotTag> tagSet = new HashSet<>();
        for (String tagName : tagsNames) {
            var tag = SpotTag.builder()
                    .name(tagName)
                    .spots(new HashSet<>())
                    .build();
            spotTagRepository.save(tag);
            tagSet.add(tag);
        }

        var spot1 = Spot.builder()
                .name("Spot1")
                .rating(3.0)
                .ratingCount(2)
                .tags(tagSet)
                .areaColor("#000000")
                .borderPoints(borderPoints)
                .centerPoint(PolygonCenterPointCalculator.calculateCenterPoint(borderPoints))
                .build();

        var spot2 = Spot.builder()
                .name("Spot2")
                .rating(4.0)
                .ratingCount(2)
                .tags(tagSet)
                .areaColor("#000000")
                .borderPoints(borderPoints)
                .centerPoint(PolygonCenterPointCalculator.calculateCenterPoint(borderPoints))
                .build();

        var spot3 = Spot.builder()
                .name("Other")
                .rating(5.0)
                .ratingCount(2)
                .tags(tagSet)
                .areaColor("#000000")
                .borderPoints(spot3BorderPoints)
                .centerPoint(PolygonCenterPointCalculator.calculateCenterPoint(spot3BorderPoints))
                .build();

        favoriteSpotRepository.deleteAll();
        List<SpotMedia> spotMedia1 = Arrays.asList(
                new SpotMedia(null, "photo1.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot1),
                new SpotMedia(null, "photo2.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot1)
        );
        List<SpotMedia> spotMedia2 = Arrays.asList(
                new SpotMedia(null, "photo1.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot2),
                new SpotMedia(null, "photo2.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot2)
        );
        List<SpotMedia> spotMedia3 = Arrays.asList(
                new SpotMedia(null, "photo1.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot3),
                new SpotMedia(null, "photo2.jpg", "alt", "description", 0, 0, GenericMediaType.PHOTO, null, null, spot3)
        );

        spot1.setMedia(spotMedia1);
        spot2.setMedia(spotMedia2);
        spot3.setMedia(spotMedia3);

        spotRepository.deleteAll();
        spotRepository.save(spot1);
        spotRepository.save(spot2);
        spotRepository.save(spot3);
    }

    @Test
    @DisplayName("Search spots should return all spots when no filters are set and spots are found.")
    void searchSpotsWithNoFiltersReturnsAllSpotsWhenSpotsFound() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response Assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSize(3)
        );
    }

    @Test
    @DisplayName("Search spot should return all spots that match filter name.")
    void searchSpotShouldReturnAllSpotsThatMatchFilterName() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map?name=p",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSize(2)
        );
    }

    @Test
    @DisplayName("Search spot should return all spots when name filter is white characters.")
    void searchSpotShouldReturnAllSpotsWhenNameFilterIsWhiteCharacters() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map?name= ",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSize(3)
        );
    }

    @Test
    @DisplayName("Search spot should return all spots when name filter is white characters.")
    void searchSpotShouldReturnAllSpotsThatMatchFilterWhenNameFilterHasWhiteCharactersAtTheBeginning() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map?name=  p",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSize(2)
        );
    }

    @Test
    @DisplayName("Search spot should return all spots when name filter is not provided.")
    void searchSpotShouldReturnAllSpotsWhenNameFilterIsNotProvided() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSize(3)
        );
    }

    @Test
    @DisplayName("Search spots should return 404 when no spots match name filter.")
    void searchSpotsShouldReturn404WhenNoSpotsMatchNameFilter() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/map?name=xxxxxxx",
                HttpMethod.GET,
                entity,
                String.class
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode(), "Status code should be 404"),
                () -> assertThat(responseEntity.getBody().contains("No spots match filters!"))
        );
    }

    @Test
    @DisplayName("getSearchedSpotsListPage should return all spots as page")
    void getSearchedSpotsListPageShouldReturnAllSpotsAsPage() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/search/list",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<CustomPageImpl<Spot>>() {
                }
        );

        PageImpl<Spot> page = responseEntity.getBody();
        var content = page.getContent();
        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be 200"),
                () -> assertEquals(3, content.size(), "Content should have 3 elements"),
                () -> assertEquals("Spot1", content.getFirst().getName(), "First spot name should be Spot1"),
                () -> assertEquals("Spot2", content.get(1).getName(), "Second spot name should be Spot2"),
                () -> assertEquals("Other", content.get(2).getName(), "Third spot name should be Other")
        );
    }

    @Test
    @DisplayName("getSpotNamesInCurrentView should return all spots in current view as page")
    void getSpotNamesInCurrentViewShouldReturnAllSpotsInCurrentViewAsPage() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/current-view?swLng=-73.969285&" +
                        "swLat=40.784091&" +
                        "neLng=-73.968285&" +
                        "neLat=40.785091&name=&sorting=none&ratingFrom=0",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<CustomPageImpl<Spot>>() {
                }
        );

        PageImpl<Spot> page = responseEntity.getBody();
        var content = page.getContent();
        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be 200"),
                () -> assertEquals(2, content.size(), "Content should have 2 elements"),
                () -> assertEquals("Spot1", content.getFirst().getName(), "First spot name should be Spot1"),
                () -> assertEquals("Spot2", content.get(1).getName(), "Second spot name should be Spot2")
        );
    }
}
