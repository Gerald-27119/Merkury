package com.merkury.vulcanus.controllers.spot;

import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.repositories.SpotRepository;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpotControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SpotRepository spotRepository;

    @BeforeEach
    void setUp() {
        var borderPoints1 = List.of(
                new BorderPoint(40.785091, -73.968285),
                new BorderPoint(40.784091, -73.969285)
        );

        var borderPoints2 = List.of(
                new BorderPoint(37.769420, -122.486214),
                new BorderPoint(37.768420, -122.487214)
        );
        var spot1 = Spot.builder()
                .name("Spot1")
                .rating(3.0)
                .areaColor("#000000")
                .borderPoints(borderPoints1)
                .build();

        var spot2 = Spot.builder()
                .name("Spot2")
                .rating(4.5)
                .areaColor("#000000")
                .borderPoints(borderPoints2)
                .build();

        spotRepository.deleteAll();
        spotRepository.save(spot1);
        spotRepository.save(spot2);
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
}
