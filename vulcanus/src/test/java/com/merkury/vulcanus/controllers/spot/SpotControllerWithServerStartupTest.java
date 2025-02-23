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
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpotControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

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
