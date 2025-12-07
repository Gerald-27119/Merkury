package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.config.properties.LocationqProviderProperties;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.features.spot.TimeZoneService;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AddSpotServiceTest {
    @Mock
    private SpotRepository spotRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private AzureBlobService azureBlobService;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private WebClient locationqWebClient;

    @Mock
    private LocationqProviderProperties props;

    @Mock
    private TimeZoneService timeZoneService;

    @InjectMocks
    private AddSpotService addSpotService;

    @Test
    void shouldReturnAllAddedSpotsWhenExist() {
        var user = UserEntity.builder().username("user1").build();
        var spot1 = Spot.builder().name("testSpot1").author(user).build();
        var spot2 = Spot.builder().name("testSpot2").author(user).build();

        var addedSpotList = List.of(spot1, spot2);
        Page<Spot> page = new PageImpl<>(addedSpotList);

        when(spotRepository.findByAuthorUsername(user.getUsername(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id")))).thenReturn(page);

        var result = addSpotService.getAllSpotsAddedByUser(user.getUsername(), 0, 10).items();

        assertAll(() -> assertEquals(2, result.size()),
                () -> assertFalse(result.isEmpty()),
                () -> assertEquals("testSpot1", result.getFirst().name()),
                () -> assertEquals("testSpot2", result.get(1).name()));
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoSpots() {
        var username = "user1";
        var emptySlice = new SliceImpl<Spot>(List.of());

        when(spotRepository.findByAuthorUsername(username, PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id")))).thenReturn(emptySlice);

        var result = addSpotService.getAllSpotsAddedByUser(username, 0, 10);

        assertAll(
                () -> assertTrue(result.items().isEmpty()),
                () -> assertFalse(result.hasNext())
        );
    }

    @Test
    void shouldPropagateHasNextFlagFromSlice() {
        var username = "user1";
        var spot = Spot.builder().name("spot1").build();

        var slice = new SliceImpl<>(List.of(spot), PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "id")), true);

        when(spotRepository.findByAuthorUsername(username, PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "id")))).thenReturn(slice);

        var result = addSpotService.getAllSpotsAddedByUser(username, 0, 1);

        assertAll(
                () -> assertEquals(1, result.items().size()),
                () -> assertTrue(result.hasNext())
        );
    }

    @Test
    void shouldAddSpotWithMediaAndSetCorrectMediaTypes() throws Exception {
        var username = "user1";

        var spotJson = """
                {
                  "name": "Spot with media",
                  "borderPoints": [
                    {"x": 10.0, "y": 20.0},
                    {"x": 11.0, "y": 21.0},
                    {"x": 12.0, "y": 22.0}
                  ]
                }
                """;

        var user = UserEntity.builder().username(username).build();
        when(userEntityFetcher.getByUsername(username)).thenReturn(user);
        when(timeZoneService.getTimeZone(anyDouble(), anyDouble())).thenReturn(Mono.just("Europe/Warsaw"));

        MultipartFile imageFile = mock(MultipartFile.class);
        when(imageFile.getContentType()).thenReturn("image/jpeg");
        when(imageFile.getOriginalFilename()).thenReturn("photo.jpg");

        MultipartFile videoFile = mock(MultipartFile.class);
        when(videoFile.getContentType()).thenReturn("video/mp4");
        when(videoFile.getOriginalFilename()).thenReturn("video.mp4");

        when(azureBlobService.upload(eq("mapa"), eq(imageFile), any())).thenReturn("https://blob/photo.jpg");
        when(azureBlobService.upload(eq("mapa"), eq(videoFile), any())).thenReturn("https://blob/video.mp4");

        ArgumentCaptor<Spot> spotCaptor = ArgumentCaptor.forClass(Spot.class);
        when(spotRepository.save(spotCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        addSpotService.addSpot(username, spotJson, List.of(imageFile, videoFile));

        Spot savedSpot = spotCaptor.getValue();

        var media1 = savedSpot.getMedia().get(0);
        var media2 = savedSpot.getMedia().get(1);

        assertAll(() -> assertNotNull(savedSpot),
                () -> assertEquals(2, savedSpot.getMedia().size()),
                () -> assertEquals("https://blob/photo.jpg", media1.getUrl()),
                () -> assertEquals("photo.jpg", media1.getAlt()),
                () -> assertEquals(GenericMediaType.PHOTO, media1.getGenericMediaType()),
                () -> assertEquals("https://blob/video.mp4", media2.getUrl()),
                () -> assertEquals("video.mp4", media2.getAlt()),
                () -> assertEquals(GenericMediaType.VIDEO, media2.getGenericMediaType()));
    }

    @Test
    void shouldThrowWhenUserNotFound() throws Exception {
        when(userEntityFetcher.getByUsername(anyString())).thenThrow(new UserNotFoundByUsernameException(""));
        assertThrows(UserNotFoundByUsernameException.class, () -> addSpotService.addSpot(anyString(), "{}", null));
    }

    @Test
    void shouldReturnBorderPointFromLocationq() {
        var response = List.of(Map.of("lat", "52.1", "lon", "21.0"));

        when(locationqWebClient.get()
                .uri((Function<UriBuilder, URI>) any())
                .retrieve()
                .bodyToMono(List.class))
                .thenReturn(Mono.just(response));

        var resultMono = addSpotService.getCoordinates("Warsaw");

        var point = resultMono.block();

        assertAll(() -> assertNotNull(point),
                () -> assertEquals(21.0, point.getX()),
                () -> assertEquals(52.1, point.getY()));
    }

    @Test
    void shouldReturnNullWhenNoResultsFromLocationq() {
        when(locationqWebClient.get()
                .uri((Function<UriBuilder, URI>) any())
                .retrieve()
                .bodyToMono(List.class))
                .thenReturn(Mono.just(List.of()));

        var resultMono = addSpotService.getCoordinates("Unknown place");

        var point = resultMono.block();

        assertNull(point);
    }

    @Test
    void shouldReturnNullWhenLocationqThrowsError() {
        when(locationqWebClient.get()
                .uri((Function<UriBuilder, URI>) any())
                .retrieve()
                .bodyToMono(List.class))
                .thenReturn(Mono.error(new RuntimeException("API error")));

        var resultMono = addSpotService.getCoordinates("Warsaw");

        var point = resultMono.block();

        assertNull(point);
    }
}
