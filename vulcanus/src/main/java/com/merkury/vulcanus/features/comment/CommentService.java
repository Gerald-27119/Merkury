package com.merkury.vulcanus.features.comment;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.comment.CommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.comment.CommentEditDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.mappers.CommentMapper;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final SpotRepository spotRepository;
    private final UserDataService userDataService;

    public Page<CommentDto> getCommentsBySpotId(Long spotId, Pageable pageable) {
        Page<Comment> commentsPage = commentRepository.findAllCommentsBySpotIdOrderByPublishDateDesc(spotId, pageable);

        return commentsPage.map(CommentMapper::toDto);
    }

    public void addComment(HttpServletRequest request, CommentAddDto dto) throws SpotNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var spot = spotRepository.findById(dto.spotId()).orElseThrow(() -> new SpotNotFoundException(dto.spotId()));
        var comment = CommentMapper.toEntity(dto, spot, user);

        commentRepository.save(comment);
    }

    public void deleteComment(HttpServletRequest request, Long commentId) {
        var user = userDataService.getUserFromRequest(request);
        var comment = commentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));

        commentRepository.delete(comment);
    }

    public void editComment(HttpServletRequest request, Long commentId, CommentEditDto dto) {
        var user = userDataService.getUserFromRequest(request);
        var comment = commentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));

        comment.setText(dto.text());
        comment.setRating(dto.rating());
        commentRepository.save(comment);
    }

    public void upvoteComment() {

    }

    public void downvoteComment() {

    }


}
