//package com.merkury.vulcanus.features.spot;
//
//import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
//import com.merkury.vulcanus.model.entities.Spot;
//import com.merkury.vulcanus.model.repositories.SpotRepository;
//import org.junit.jupiter.api.AfterAll;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import org.testcontainers.containers.GenericContainer;
//import org.testcontainers.junit.jupiter.Container;
//import org.testcontainers.junit.jupiter.Testcontainers;
//import org.testcontainers.utility.DockerImageName;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//
//@Testcontainers
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@ActiveProfiles("test")
//class SpotServiceWithServerStartupTest {//change name?
////https://java.testcontainers.org/quickstart/junit_5_quickstart/ - w tym poradniku cos? dpcker blouje? nie no ale port sie nie zgadza
//
//    @Container
//    public static GenericContainer<?> redis = new GenericContainer(DockerImageName.parse("redis:6-alpine"))
//            .withExposedPorts(6379);//czemu to wcale nie ustawiw an asztywno?
//
//    @BeforeAll
//    static void beforeAll() {
////        redis.start();
//
//    }
//
//    @AfterAll
//    static void afterAll() {
//        redis.stop();//potrzebne?
//    }
//
//    @Autowired
//    private SpotService spotService;
//
//    @Autowired
//    private SpotRepository spotRepository;
//
//    @BeforeEach
//    public void setUp() {
//        spotRepository.deleteAll();
//        spotRepository.saveAll(
//                List.of(
//                        Spot.builder().name("Plac zabaw 1").rating(1.0).build(),
//                        Spot.builder().name("Plac zabaw 2").rating(2.0).build(),
//                        Spot.builder().name("Plac zabaw 3").rating(3.0).build(),
//                        Spot.builder().name("Plac zabaw 4").rating(4.0).build(),
//                        Spot.builder().name("Plac zabaw 5").rating(5.0).build()
//                )
//        );
//    }
//
//    @DisplayName("After adding new spot, the old, cached value should be returned")
//    @Test
//    public void testGetFilteredSpotsCaching() throws SpotsNotFoundException {
////        redis.start();
//        assertTrue(redis.isRunning());
//        String address = redis.getHost();
//        Integer port = redis.getFirstMappedPort();
//        System.out.println("Address: " + address + " Port: " + port);
//
//        var result1 = spotService.getFilteredSpots("Plac", 1.0, 5.0);
//        spotRepository.save(Spot.builder().name("Plac testowy").build());
//        var result2 = spotService.getFilteredSpots("Plac", 1.0, 5.0);
//
//        assertEquals(result1, result2);
//    }
//}

package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class SpotServiceWithServerStartupTest {

    private static final int REDIS_PORT = 6379;
    private static final String REDIS_IMAGE_NAME = "redis:6-alpine";

    @Container
    public static GenericContainer<?> redis = new GenericContainer<>(DockerImageName.parse(REDIS_IMAGE_NAME))
            .withExposedPorts(REDIS_PORT);

    @DynamicPropertySource
    static void setRedisProperties(DynamicPropertyRegistry registry) {
        System.out.println("Address: " + redis.getHost() + " Port: " + redis.getMappedPort(REDIS_PORT));
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", () -> redis.getMappedPort(REDIS_PORT));
    }

    @AfterAll
    static void afterAll() {
        redis.stop();
    }

    @Autowired
    private SpotService spotService;

    @Autowired
    private SpotRepository spotRepository;

    @BeforeEach
    public void setUp() {
        spotRepository.deleteAll();
        spotRepository.saveAll(
                List.of(
                        Spot.builder().name("Plac zabaw 1").rating(1.0).build(),
                        Spot.builder().name("Plac zabaw 2").rating(2.0).build(),
                        Spot.builder().name("Plac zabaw 3").rating(3.0).build(),
                        Spot.builder().name("Plac zabaw 4").rating(4.0).build(),
                        Spot.builder().name("Plac zabaw 5").rating(5.0).build()
                )
        );
    }

    @DisplayName("After adding new spot, the old, cached value should be returned")
    @Test
    public void testGetFilteredSpotsCaching() throws SpotsNotFoundException {
        // Verify that our Redis container is running
        assertTrue(redis.isRunning());

        var result1 = spotService.getFilteredSpots("Plac", 1.0, 5.0);
        spotRepository.save(Spot.builder().name("Plac testowy").build());
        var result2 = spotService.getFilteredSpots("Plac", 1.0, 5.0);

        assertEquals(result1, result2);
    }
}

