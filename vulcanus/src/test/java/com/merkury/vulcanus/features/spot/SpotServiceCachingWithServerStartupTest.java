package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class SpotServiceCachingWithServerStartupTest {

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

    @Autowired
    private SpotService spotService;

    @Autowired
    private SpotRepository spotRepository;

    @DisplayName("After adding new spot, old, cached filtered spots should be returned")
    @Test
    public void shouldReturnCachedFilteredSpotsWhenNewSpotAdded() throws SpotsNotFoundException {
        var initialCount = spotService.getSearchedSpotsOnMap("Plac").size();

        var newSpot = Spot.builder()
                .name("Plac 1")
                .country("country")
                .city("city")
                .areaColor("green")
                .description("text")
                .spotComments(new ArrayList<>())
                .borderPoints(List.of(
                        new BorderPoint(54.34259835347914, 18.646824493647234),
                        new BorderPoint(54.34199917555038, 18.64785810853534)))
                .rating(5.0)
                .media(new ArrayList<>())
                .build();
        spotRepository.save(newSpot);

        var cachedCount = spotService.getSearchedSpotsOnMap("Plac").size();
        assertEquals(initialCount, cachedCount);
    }

    @DisplayName("Cached spot names result should remain unchanged after adding new spot")
    @Test
    public void shouldReturnCachedNamesResultWhenNewSpotAdded() throws SpotsNotFoundException {
        var initialNames = spotService.getFilteredSpotsNames("Plac");

        Spot newSpot = Spot.builder()
                .name("Plac test")
                .country("country")
                .city("city")
                .areaColor("green")
                .description("text")
                .spotComments(new ArrayList<>())
                .borderPoints(List.of(
                        new BorderPoint(54.34259835347914, 18.646824493647234),
                        new BorderPoint(54.34199917555038, 18.64785810853534)))
                .rating(5.0)
                .media(new ArrayList<>())
                .build();
        spotRepository.save(newSpot);

        var cachedNames = spotService.getFilteredSpotsNames("Plac");
        assertEquals(initialNames, cachedNames);
    }

}
