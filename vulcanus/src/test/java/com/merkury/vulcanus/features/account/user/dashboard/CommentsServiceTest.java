package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.DateSortType.DATE_ASCENDING;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class CommentsServiceTest {
    @Mock
    private SpotCommentRepository spotCommentRepository;

    @InjectMocks
    private CommentsService commentsService;

    @Test
    void shouldReturnAllCommentsWhenExist() throws UnsupportedDateSortTypeException {
        var user = UserEntity.builder().username("user1").build();

        var spot = new Spot();
        spot.setName("Spot 1");

        var now = LocalDateTime.now();

        var comment1 = SpotComment.builder()
                .author(user)
                .spot(spot)
                .text("comment text 1")
                .publishDate(now)
                .build();

        var comment2 = SpotComment.builder()
                .author(user)
                .spot(spot)
                .text("comment text 2")
                .publishDate(now)
                .build();

        Slice<SpotComment> commentsSlice = new SliceImpl<>(List.of(comment1, comment2));

        when(spotCommentRepository.findAllByAuthorUsername(eq("user1"), any(Pageable.class)))
                .thenReturn(commentsSlice);

        var result = commentsService
                .getSortedUserComments("user1", DATE_ASCENDING, null, null, 0, 10)
                .items();

        assertAll(
                () -> assertFalse(result.isEmpty()),
                () -> assertEquals(1, result.size()),
                () -> assertEquals(2, result.getFirst().comments().size()),
                () -> assertEquals(now.toLocalDate(), result.getFirst().date()),
                () -> assertEquals("Spot 1", result.getFirst().spotName())
        );
    }

    @Test
    void shouldThrowUnsupportedCommentsSortTypeExceptionWhenEntryWrongType() {
        assertThrows(UnsupportedDateSortTypeException.class,
                () -> commentsService.getSortedUserComments("testUser", DateSortType.UNKNOWN, null, null, 0, 10));
    }

    @Test
    void shouldReturnFilteredAndSortedCommentsForUserWithinGivenDateRange() throws UnsupportedDateSortTypeException {
        var user = UserEntity.builder().username("user1").build();

        var spot = new Spot();
        spot.setName("Spot 2");

        var publishDate = LocalDateTime.of(2025, 6, 15, 10, 30);

        var comment = SpotComment.builder()
                .author(user)
                .spot(spot)
                .text("filtered comment")
                .publishDate(publishDate)
                .build();

        Slice<SpotComment> commentsSlice = new SliceImpl<>(List.of(comment));

        when(spotCommentRepository.findAllByAuthorUsernameAndPublishDateBetween(
                eq("user1"),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                any(Pageable.class)
        )).thenReturn(commentsSlice);

        var result = commentsService
                .getSortedUserComments(
                        "user1",
                        DATE_ASCENDING,
                        LocalDate.of(2025, 6, 15),
                        LocalDate.of(2025, 6, 16),
                        0,
                        10
                )
                .items();

        assertAll(
                () -> assertFalse(result.isEmpty()),
                () -> assertEquals(1, result.size()),
                () -> assertEquals(
                        1,
                        result.stream()
                                .filter(g -> g.date().equals(LocalDate.of(2025, 6, 15)))
                                .findFirst()
                                .map(g -> g.comments().size())
                                .orElse(0)
                ),
                () -> assertTrue(result.stream()
                        .allMatch(g -> g.comments().stream()
                                .allMatch(c -> "filtered comment".equals(c.text())))),
                () -> assertTrue(result.stream()
                        .allMatch(g -> g.comments().stream()
                                .allMatch(c -> "Spot 2".equals(c.spotName()))))
        );
    }
}
