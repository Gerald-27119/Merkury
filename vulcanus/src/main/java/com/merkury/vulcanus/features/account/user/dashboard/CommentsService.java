package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.CommentsMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService extends GroupedDataService{
    private final SpotCommentRepository spotCommentRepository;

    public List<DatedCommentsGroupDto> getSortedUserComments(String username, DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        return getAllUserComments(username, from, to).stream()
                .sorted(comparingDate(DatedCommentsGroupDto::date, type))
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

    private record GroupKey(LocalDate date, String spotName) {
    }

}
