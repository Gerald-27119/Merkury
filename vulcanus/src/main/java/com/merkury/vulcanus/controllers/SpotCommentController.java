package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.SpotMediaNumberOfMediaExceeded;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.spot.SpotCommentService;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentAddDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentEditDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentMediaDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentUserVoteInfoDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SpotCommentController {

    private static final int SPOT_COMMENTS_PAGE_SIZE = 2;
    private final SpotCommentService spotCommentService;

    @GetMapping("/public/spot/{spotId}/comments")
    public ResponseEntity<Page<SpotCommentDto>> getCommentsBySpotId(HttpServletRequest request, @PathVariable Long spotId, @RequestParam(defaultValue = "0") int page) throws UserNotFoundException {
        Page<SpotCommentDto> comments = spotCommentService.getCommentsBySpotId(request, spotId, PageRequest.of(page, SPOT_COMMENTS_PAGE_SIZE));

        return ResponseEntity.ok(comments);
    }

    @GetMapping("/public/spot/{spotId}/comments/{commentId}")
    public ResponseEntity<List<SpotCommentMediaDto>> getRestOfSpotCommentMedia(@PathVariable Long spotId, @PathVariable Long commentId) {
        return ResponseEntity.ok(spotCommentService.getRestOfSpotCommentMedia(spotId, commentId));
    }

    @PostMapping("/spot/{spotId}/comments")
    public ResponseEntity<Void> addComment(@PathVariable Long spotId, @Valid @RequestBody SpotCommentAddDto spotCommentAddDto, List<MultipartFile> mediaFiles) throws SpotNotFoundException, UserNotFoundException, InvalidFileTypeException, BlobContainerNotFoundException, IOException, SpotMediaNumberOfMediaExceeded {
        spotCommentService.addComment(spotCommentAddDto, spotId, mediaFiles);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/spot/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(HttpServletRequest request, @PathVariable Long commentId) throws CommentAccessException, UserNotFoundException {
        spotCommentService.deleteComment(request, commentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/spot/comments/{commentId}")
    public ResponseEntity<SpotCommentDto> editComment(HttpServletRequest request, @PathVariable Long commentId, @Valid @RequestBody SpotCommentEditDto spotCommentEditDto) throws CommentAccessException, UserNotFoundException {
        spotCommentService.editComment(request, commentId, spotCommentEditDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/spot/comments/{commentId}/vote")
    public ResponseEntity<Void> voteComment(HttpServletRequest request, @PathVariable Long commentId, @RequestParam boolean isUpvote) throws UserNotFoundException, CommentNotFoundException {
        spotCommentService.voteComment(request, commentId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/spot/comments/vote-type")
    public ResponseEntity<SpotCommentUserVoteInfoDto> getVoteInfo(@RequestParam Long commentId) {
        log.debug("getVoteInfo({})", commentId);
        return ResponseEntity.ok(spotCommentService.getVoteInfo(commentId));
    }
}
