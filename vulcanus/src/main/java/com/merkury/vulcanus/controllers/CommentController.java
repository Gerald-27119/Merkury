package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.comment.CommentService;
import com.merkury.vulcanus.model.dtos.comment.CommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.comment.CommentEditDto;
import jakarta.servlet.http.HttpServletRequest;
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
    public ResponseEntity<Page<CommentDto>> getCommentsBySpotId(@PathVariable Long spotId, @RequestParam(defaultValue = "0") int page) {
        int defaultPageSize = 5;
        Page<CommentDto> comments = commentService.getCommentsBySpotId(spotId, PageRequest.of(page, defaultPageSize));

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/spot/comments")
    public ResponseEntity<String> addComment(HttpServletRequest request, @RequestBody CommentAddDto commentAddDto) throws SpotNotFoundException {
        commentService.addComment(request, commentAddDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/spot/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(HttpServletRequest request, @PathVariable Long commentId) {
        commentService.deleteComment(request, commentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/spot/comments/{commentId}")
    public ResponseEntity<CommentDto> editComment(HttpServletRequest request, @PathVariable Long commentId, @RequestBody CommentEditDto commentEditDto) {
        commentService.editComment(request, commentId, commentEditDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/spot/comments/{commentId}/upvote")
    public ResponseEntity<Void> upvoteComment(HttpServletRequest request, @PathVariable Long commentId) {
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/spot/comments/{commentId}/downvote")
    public ResponseEntity<Void> downvoteComment(HttpServletRequest request, @PathVariable Long commentId) {
        return ResponseEntity.ok().build();
    }
}
