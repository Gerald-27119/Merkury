package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupPageDto;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.CommentsMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService {
    private final SpotCommentRepository spotCommentRepository;

    public DatedCommentsGroupPageDto getSortedUserComments(String username, DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserComments(username, from, to, type, page, size);
    }

    /**
     * 'publishDate' in SpotComment is a LocalDateTime, so we must pass LocalDateTime to the query.
     * Here we convert 'from' to the end of the day (23:59:59) to ensure we include
     * all comments published during that day and after.
     */
    private DatedCommentsGroupPageDto getAllUserComments(String username, LocalDate from, LocalDate to, DateSortType sortType, int page, int size) throws UnsupportedDateSortTypeException {
        Pageable pageable = PageRequest.of(page, size, getSpringSort(sortType));
        Page<SpotComment> comments;

        if (from == null && to == null) {
            comments = spotCommentRepository.findAllByAuthorUsername(username, pageable);
        } else if (from != null && to == null) {
            comments = spotCommentRepository.findAllByAuthorUsernameAndPublishDateGreaterThanEqual(username, from.atTime(23, 59, 59), pageable);
        } else if (from == null) {
            comments = spotCommentRepository.findAllByAuthorUsernameAndPublishDateLessThanEqual(username, to.atTime(23, 59, 59), pageable);
        } else {
            comments = spotCommentRepository.findAllByAuthorUsernameAndPublishDateBetween(username, from.atTime(23, 59, 59), to.atTime(23, 59, 59), pageable);
        }

        var mappedComments = comments.stream()
                .collect(Collectors.groupingBy(
                        comment ->
                                new GroupKey(comment.getPublishDate().toLocalDate(), comment.getSpot().getName()),
                        Collectors.mapping(CommentsMapper::toDto, Collectors.toList())
                )).entrySet()
                .stream()
                .map(listEntry ->
                        CommentsMapper
                                .toDto(listEntry.getValue(), listEntry.getKey().date, listEntry.getKey().spotName))
                .toList();

        return new DatedCommentsGroupPageDto(mappedComments, comments.hasNext());
    }

    private Sort getSpringSort(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_ASCENDING -> Sort.by("publishDate").ascending();
            case DATE_DESCENDING -> Sort.by("publishDate").descending();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }

    private record GroupKey(LocalDate date, String spotName) {
    }
}
