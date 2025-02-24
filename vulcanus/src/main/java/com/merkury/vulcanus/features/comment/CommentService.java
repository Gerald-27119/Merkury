package com.merkury.vulcanus.features.comment;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.comment.CommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.comment.CommentEditDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.mappers.CommentMapper;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final SpotRepository spotRepository;
    private final UserDataService userDataService;

    public Page<CommentDto> getCommentsBySpotId(HttpServletRequest request, Long spotId, Pageable pageable) {
        Page<Comment> commentsPage = commentRepository.findAllCommentsBySpotIdOrderByPublishDateDesc(spotId, pageable);
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return commentsPage.map(comment -> CommentMapper.toDto(comment, user));
    }

    public void addComment(HttpServletRequest request, CommentAddDto dto) throws SpotNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var spot = spotRepository.findById(dto.spotId()).orElseThrow(() -> new SpotNotFoundException(dto.spotId()));
        var comment = CommentMapper.toEntity(dto, spot, user);

        commentRepository.save(comment);
        spot.setRating(calculateSpotRating(spot.getId()));
        updateSpotRating(spot);
    }

    public void deleteComment(HttpServletRequest request, Long commentId) {
        var user = userDataService.getUserFromRequest(request);
        var comment = commentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));
        var spot = comment.getSpot();

        commentRepository.delete(comment);
        updateSpotRating(spot);
    }

    public void editComment(HttpServletRequest request, Long commentId, CommentEditDto dto) {
        var user = userDataService.getUserFromRequest(request);
        var comment = commentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));
        var spot = comment.getSpot();

        comment.setText(dto.text());
        comment.setRating(dto.rating());

        commentRepository.save(comment);
        updateSpotRating(spot);
    }

    private Double calculateSpotRating(Long spotId) {
        var comments = commentRepository.findBySpotId(spotId);

        if (comments.isEmpty()) {
            return 0.0;
        }

        double average = comments.stream()
                .mapToDouble(Comment::getRating)
                .average()
                .orElse(0.0);

        return BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private void updateSpotRating(Spot spot) {
        spot.setRating(calculateSpotRating(spot.getId()));
        spotRepository.save(spot);
    }

    public void upvoteComment(HttpServletRequest request, Long commentId) {
        var user = userDataService.getUserFromRequest(request);
        var userId = user.getId();
        var comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        if (comment.getUpvotedBy().removeIf(u -> u.getId().equals(userId))) {
            comment.setUpvotes(comment.getUpvotes() - 1);
        } else {
            if (comment.getDownvotedBy().removeIf(u -> u.getId().equals(userId))) {
                comment.setDownvotes(comment.getDownvotes() - 1);
            }
            comment.getUpvotedBy().add(user);
            comment.setUpvotes(comment.getUpvotes() + 1);
        }

        commentRepository.save(comment);
    }

    public void downvoteComment(HttpServletRequest request, Long commentId) {
        var user = userDataService.getUserFromRequest(request);
        var userId = user.getId();
        var comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        if (comment.getDownvotedBy().removeIf(u -> u.getId().equals(userId))) {
            comment.setDownvotes(comment.getDownvotes() - 1);
        } else {
            if (comment.getUpvotedBy().removeIf(u -> u.getId().equals(userId))) {
                comment.setUpvotes(comment.getUpvotes() - 1);
            }
            comment.getDownvotedBy().add(user);
            comment.setDownvotes(comment.getDownvotes() + 1);
        }

        commentRepository.save(comment);
    }
}
