package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.CommentsMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService {
    private final SpotCommentRepository spotCommentRepository;

    public List<DatedCommentsGroupDto> getSortedUserComments(String username, DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        return getAllUserComments(username, from, to).stream()
                .sorted(getComparator(type))
                .toList();
    }

    private List<DatedCommentsGroupDto> getAllUserComments(String username, LocalDate from, LocalDate to) {
        return spotCommentRepository.findAllByAuthorUsername(username)
                .stream()
                .filter(comment -> isInDateRange(comment.getPublishDate().toLocalDate(), from, to))
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
    }

    private record GroupKey(LocalDate date, String spotName) {
    }

    private boolean isInDateRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from)) && (to == null || !date.isAfter(to));
    }

    private Comparator<DatedCommentsGroupDto> getComparator(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_INCREASE -> Comparator.comparing(DatedCommentsGroupDto::date);
            case DATE_DECREASE -> Comparator.comparing(DatedCommentsGroupDto::date).reversed();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }
}
