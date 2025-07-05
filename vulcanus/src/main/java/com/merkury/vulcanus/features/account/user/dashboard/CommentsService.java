package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedPhotoSortTypeException;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.enums.user.dashboard.PhotoSortType;
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

    public List<DatedCommentsGroupDto> getSortedUserComments(String username, PhotoSortType type, LocalDate from, LocalDate to) throws UnsupportedPhotoSortTypeException {
        return getAllUserComments(username, from, to).stream()
                .sorted(getComparator(type))
                .toList();
    }

    private List<DatedCommentsGroupDto> getAllUserComments(String username, LocalDate from, LocalDate to) {
        return spotCommentRepository.findAllByAuthorUsername(username)
                .stream()
                .filter(c -> isInDateRange(c.getPublishDate().toLocalDate(), from, to))
                .collect(Collectors.groupingBy(
                        c -> new GroupKey(c.getPublishDate().toLocalDate(), c.getSpot().getName()),
                        Collectors.mapping(CommentsMapper::toDto, Collectors.toList())
                )).entrySet()
                .stream()
                .map(c -> CommentsMapper.toDto(c.getValue(), c.getKey().date, c.getKey().spotName))
                .toList();
    }

    private boolean isInDateRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from)) && (to == null || !date.isAfter(to));
    }

    private Comparator<DatedCommentsGroupDto> getComparator(PhotoSortType type) throws UnsupportedPhotoSortTypeException {
        return switch (type) {
            case DATE_INCREASE -> Comparator.comparing(DatedCommentsGroupDto::date);
            case DATE_DECREASE -> Comparator.comparing(DatedCommentsGroupDto::date).reversed();
            default -> throw new UnsupportedPhotoSortTypeException(type);
        };
    }

    private record GroupKey(LocalDate date, String spotName) {
    }

}
