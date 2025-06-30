package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.mappers.user.dashboard.CommentsMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                        SpotComment::getAddDate,
                        Collectors.mapping(CommentsMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(c -> CommentsMapper.toDto(c.getValue(), c.getKey().toLocalDate()))
                .toList();
    }
}
