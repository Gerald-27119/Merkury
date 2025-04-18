package com.merkury.vulcanus.features.comment;

import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.comment.SpotCommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.SpotCommentDto;
import com.merkury.vulcanus.model.dtos.comment.SpotCommentEditDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.mappers.SpotCommentMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SpotCommentService {

    private final SpotCommentRepository spotCommentRepository;
    private final SpotRepository spotRepository;
    private final UserDataService userDataService;

    public Page<SpotCommentDto> getCommentsBySpotId(HttpServletRequest request, Long spotId, Pageable pageable) {
        Page<SpotComment> commentsPage = spotCommentRepository.findBySpotIdOrderByPublishDateDescIdAsc(spotId, pageable);
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return commentsPage.map(comment -> SpotCommentMapper.toDto(comment, user));
    }

    public void addComment(HttpServletRequest request, SpotCommentAddDto dto, Long spotId) throws SpotNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var spot = spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));

        spotCommentRepository.save(SpotCommentMapper.toEntity(dto, spot, user));
        updateSpotRating(spot);
    }

    public void deleteComment(HttpServletRequest request, Long commentId) throws CommentAccessException {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("delete"));

        spotCommentRepository.delete(comment);
        updateSpotRating(comment.getSpot());
    }

    public void editComment(HttpServletRequest request, Long commentId, SpotCommentEditDto dto) throws CommentAccessException {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("edit"));

        comment.setText(dto.text());
        comment.setRating(dto.rating());

        spotCommentRepository.save(comment);
        updateSpotRating(comment.getSpot());
    }

    private Double calculateSpotRating(Long spotId) {
        var comments = spotCommentRepository.findBySpotId(spotId);

        if (comments.isEmpty()) {
            return 0.0;
        }

        double average = comments.stream()
                .mapToDouble(SpotComment::getRating)
                .average()
                .orElse(0.0);

        return BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private void updateSpotRating(Spot spot) {
        spot.setRating(calculateSpotRating(spot.getId()));
        spotRepository.save(spot);
    }

    public void voteComment(HttpServletRequest request, Long commentId, boolean isUpvote) {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        var voteList = isUpvote ? comment.getUpvotedBy() : comment.getDownvotedBy();
        var oppositeVoteList = isUpvote ? comment.getDownvotedBy() : comment.getUpvotedBy();

        if (voteList.contains(user)) {
            removeUserFromVoteList(voteList, user);
        } else {
            removeUserFromVoteList(oppositeVoteList, user);
            addUserToVoteList(voteList, user);
        }

        comment.setUpvotes(comment.getUpvotedBy().size());
        comment.setDownvotes(comment.getDownvotedBy().size());

        spotCommentRepository.save(comment);
    }

    private void removeUserFromVoteList(Set<UserEntity> voteList, UserEntity user) {
        voteList.remove(user);
    }

    private void addUserToVoteList(Set<UserEntity> voteList, UserEntity user) {
        voteList.add(user);
    }

}
