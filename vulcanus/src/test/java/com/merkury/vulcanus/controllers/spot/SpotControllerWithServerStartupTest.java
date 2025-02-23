package com.merkury.vulcanus.controllers.spot;

import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
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

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpotControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SpotRepository spotRepository;

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
        var spot1 = Spot.builder()
                .name("Spot1")
                .rating(3.0)
                .areaColor("#000000")
                .borderPoints(borderPoints)
                .build();

        spotRepository.deleteAll();
        spotRepository.save(spot1);
    }

    @Test
    @DisplayName("Filter spots should return all spots when no filters are set and spots are found.")
    void filterSpotsWithNoFiltersReturnsAllSpotsWhenSpotsFound() {

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {}
        );

        assertAll("Response Assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty")
        );
    }

    @Test
    @DisplayName("Filter spots should return 404 when no spots match filters.")
    void filterSpotsShouldReturn404WhenNoSpotsMatchFilters() {

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter?name=xxxxxxx",
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
    @DisplayName("Filter spot should return at least one spot when name filter matches.")
    void filterSpotShouldReturnAtLeastSpotWhenNameFilterMatches() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter?name=p",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {}
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSizeGreaterThanOrEqualTo(1)
        );
    }

    @Test
    @DisplayName("Filter spot should return at least one spot when rating filters match.")
    void filterSpotShouldReturnAtLeastOneSpotWhenRatingFiltersMatch() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter?minRating=2.0&maxRating=3.5",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {}
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSizeGreaterThanOrEqualTo(1)
        );
    }

    @Test
    @DisplayName("Filter spot should return at least one spot when all filters match.")
    void filterSpotShouldReturnAtLeastOneSpotWhenAllFiltersMatch() {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter?name=p&minRating=2.0&maxRating=3.5",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {}
        );

        assertAll("Response assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty"),
                () -> assertThat(responseEntity.getBody()).hasSizeGreaterThanOrEqualTo(1)
        );
    }
}
