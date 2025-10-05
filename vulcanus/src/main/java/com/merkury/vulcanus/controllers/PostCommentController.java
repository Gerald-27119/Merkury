package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.forum.PostCommentService;
import com.merkury.vulcanus.model.dtos.forum.ForumPostCommentReplyPageDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.enums.forum.ForumPostCommentSortField;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class PostCommentController {

    private final PostCommentService postCommentService;

    @GetMapping("/public/post/{postId}/comments")
    public ResponseEntity<Page<PostCommentGeneralDto>> getCommentsByPostId(HttpServletRequest request,
                                                                           @PathVariable Long postId,
                                                                           @RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "10") int size,
                                                                           @RequestParam(defaultValue = "PUBLISH_DATE") ForumPostCommentSortField sortBy,
                                                                           @RequestParam(defaultValue = "DESC") String sortDirection) throws UserNotFoundException {
        return ResponseEntity.ok(postCommentService.getCommentsByPostId(request, PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy.getField())), postId));
    }

    @GetMapping("/public/comments/{commentId}/replies")
    public ResponseEntity<ForumPostCommentReplyPageDto> getCommentRepliesByCommentId(HttpServletRequest request,
                                                                                     @PathVariable Long commentId,
                                                                                     @RequestParam(required = false) LocalDateTime lastDate,
                                                                                     @RequestParam(required = false) Long lastId,
                                                                                     @RequestParam(defaultValue = "10") int size) throws UserNotFoundException {

        var page = postCommentService.getCommentRepliesByCommentId(request, commentId, lastDate, lastId, size);
        return ResponseEntity.ok(page);
    }

    @PostMapping("/post/{postId}/comments")
    public ResponseEntity<Void> addPostComment(HttpServletRequest request, @PathVariable Long postId, @Valid @RequestBody PostCommentDto dto) throws UserNotFoundException, PostNotFoundException {
        postCommentService.addComment(request, postId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/post/comments/{commentId}")
    public ResponseEntity<Void> deletePostComment(HttpServletRequest request, @PathVariable Long commentId) throws UserNotFoundException, CommentAccessException {
        postCommentService.deleteComment(request, commentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/post/comments/{commentId}")
    public ResponseEntity<Void> editPostComment(HttpServletRequest request, @PathVariable Long commentId, @Valid @RequestBody PostCommentDto dto) throws UserNotFoundException, CommentAccessException {
        postCommentService.editComment(request, commentId, dto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/comments/{commentId}/vote")
    public ResponseEntity<Void> votePostComment(HttpServletRequest request, @PathVariable Long commentId, @RequestParam boolean isUpvote) throws UserNotFoundException, CommentNotFoundException {
        postCommentService.voteComment(request, commentId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/comments/{commentId}/replies")
    public ResponseEntity<Void> addReplyPostComment(HttpServletRequest request, @PathVariable Long commentId, @Valid @RequestBody PostCommentDto dto) throws UserNotFoundException, CommentNotFoundException {
        postCommentService.addReplyToComment(request, commentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
