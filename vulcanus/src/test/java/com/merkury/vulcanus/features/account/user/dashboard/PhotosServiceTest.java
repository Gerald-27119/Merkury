package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.repositories.ImgRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.DateSortType.DATE_ASCENDING;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class PhotosServiceTest {
    @Mock
    private ImgRepository imgRepository;

    @InjectMocks
    private PhotosService photosService;

    @Test
    void shouldReturnAllPhotosWhenExist() throws UnsupportedDateSortTypeException {
        var user = UserEntity.builder().username("user1").build();
        var photo1 = Img.builder().author(user).addDate(LocalDate.now()).likes(10).views(12).build();
        var photo2 = Img.builder().author(user).addDate(LocalDate.now()).likes(10).views(12).build();
        var photosList = List.of(photo1, photo2);

        when(imgRepository.findAllByAuthorUsername("user1")).thenReturn(photosList);

        var result = photosService.getSortedUserPhotos("user1", DATE_ASCENDING, null, null);

        assertAll(() -> assertFalse(result.isEmpty()),
                () -> assertEquals(1, result.size()),
                () -> assertEquals(2, result.stream()
                        .filter(p -> p.date().equals(LocalDate.now()))
                        .findFirst()
                        .map(p -> p.photos().size()).orElse(0)),
                () -> assertTrue(result.stream().anyMatch(p -> p.date().equals(LocalDate.now()))));
    }

    @Test
    void shouldThrowUnsupportedPhotoSortTypeExceptionWhenEntryWrongType() {
        assertThrows(UnsupportedDateSortTypeException.class,
                () -> photosService.getSortedUserPhotos(anyString(), DateSortType.UNKNOWN, null, null));
    }

    @Test
    void shouldReturnFilteredAndSortedPhotosForUserWithinGivenDateRange() throws UnsupportedDateSortTypeException {
        var user = UserEntity.builder().username("user1").build();
        var photo1 = Img.builder().author(user).addDate(LocalDate.of(2025, 6, 14)).likes(10).views(12).build();
        var photo2 = Img.builder().author(user).addDate(LocalDate.of(2025, 6, 15)).likes(12).views(15).build();
        var photosList = List.of(photo1, photo2);

        when(imgRepository.findAllByAuthorUsername("user1")).thenReturn(photosList);

        var result = photosService
                .getSortedUserPhotos("user1", DATE_ASCENDING,
                        LocalDate.of(2025, 6, 15),
                        LocalDate.of(2025, 6, 16));

        assertAll(() -> assertFalse(result.isEmpty()),
                () -> assertEquals(1, result.size()),
                () -> assertEquals(1, result.stream()
                        .filter(p -> p.date().equals(LocalDate.of(2025, 6, 15)))
                        .findFirst()
                        .map(p -> p.photos().size()).orElse(0)),
                () -> assertTrue(result.stream().allMatch(g -> g.photos().stream().allMatch(p -> p.heartsCount().equals(12)))),
                () -> assertTrue(result.stream().allMatch(g -> g.photos().stream().allMatch(p -> p.viewsCount().equals(15)))));
    }
}
