package com.merkury.vulcanus.controllers.spot;

import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpotControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SpotRepository spotRepository;

    @MockBean
    private SpotService spotService;

    @Test
    @DisplayName("Filter spots should return all spots when no filters are set and spots are found.")
    void filterSpotsWithNoFiltersReturnsAllSpotsWhenSpotsFound() throws SpotsNotFoundException {

        List<GeneralSpotDto> dummySpots = List.of(
                GeneralSpotDto.builder()
                        .id(1L)
                        .name("Central Park")
                        .rating(3.0)
                        .areaColor("#00FF00")
                        .build(),
                GeneralSpotDto.builder()
                        .id(2L)
                        .name("Golden Gate Park")
                        .rating(4.5)
                        .areaColor("#FFD700")
                        .build()
        );

        when(spotService.getFilteredSpots("", 0.0, 5.0)).thenReturn(dummySpots);


        var responseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/public/spot/filter",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<GeneralSpotDto>>() {
                }
        );

        assertAll("Response Assertions",
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode(), "Status code should be OK"),
                () -> assertNotNull(responseEntity.getBody(), "Response body should not be null"),
                () -> assertFalse(responseEntity.getBody().isEmpty(), "Response body should not be empty")
        );

    }
}
