package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.mappers.user.dashboard.CommentsMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService {
    private final SpotCommentRepository spotCommentRepository;

    public List<DatedCommentsGroupDto> getAllUserComments(String username) {
        var comments = spotCommentRepository.findAllByAuthorUsername(username);

        return comments.stream()
                .collect(Collectors.groupingBy(
                        c -> new GroupKey(c.getPublishDate().toLocalDate(), c.getSpot().getName()),
                        Collectors.mapping(CommentsMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(c -> CommentsMapper.toDto(c.getValue(), c.getKey().date, c.getKey().spotName))
                .toList();
    }

    private record GroupKey(LocalDate date, String spotName) {}

}
