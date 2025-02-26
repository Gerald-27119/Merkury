package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.comment.CommentService;
import com.merkury.vulcanus.model.dtos.comment.CommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.comment.CommentEditDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/public/spot/{spotId}/comments")
    public ResponseEntity<Page<CommentDto>> getCommentsBySpotId(HttpServletRequest request, @PathVariable Long spotId, @RequestParam(defaultValue = "0") int page) {
        int defaultPageSize = 5;
        Page<CommentDto> comments = commentService.getCommentsBySpotId(request, spotId, PageRequest.of(page, defaultPageSize));

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/spot/{spotId}/comments")
    public ResponseEntity<String> addComment(HttpServletRequest request, @PathVariable Long spotId, @Valid @RequestBody CommentAddDto commentAddDto) throws SpotNotFoundException {
        commentService.addComment(request, commentAddDto, spotId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/spot/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(HttpServletRequest request, @PathVariable Long commentId) throws CommentAccessException {
        commentService.deleteComment(request, commentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/spot/comments/{commentId}")
    public ResponseEntity<CommentDto> editComment(HttpServletRequest request, @PathVariable Long commentId, @Valid @RequestBody CommentEditDto commentEditDto) throws CommentAccessException {
        commentService.editComment(request, commentId, commentEditDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/spot/comments/{commentId}/vote")
    public ResponseEntity<Void> voteComment(HttpServletRequest request, @PathVariable Long commentId, @RequestParam boolean isUpvote) {
        commentService.voteComment(request, commentId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
