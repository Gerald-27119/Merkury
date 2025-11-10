package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.forum.PostCommentService;
import com.merkury.vulcanus.model.dtos.forum.ForumPostCommentReplyPageDto;
import com.merkury.vulcanus.model.dtos.forum.ForumReportDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.enums.forum.PostCommentSortField;
import com.merkury.vulcanus.model.enums.forum.SortDirection;
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
    public ResponseEntity<Page<PostCommentGeneralDto>> getPaginatedCommentsByPostId(@PathVariable Long postId,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size,
                                                                                    @RequestParam(defaultValue = "PUBLISH_DATE") PostCommentSortField sortBy,
                                                                                    @RequestParam(defaultValue = "DESC") SortDirection sortDirection) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(postCommentService.getPaginatedCommentsByPostId(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection.name()), sortBy.getField())), postId));
    }

    @GetMapping("/public/comments/{commentId}/replies")
    public ResponseEntity<ForumPostCommentReplyPageDto> getPaginatedCommentRepliesByCommentId(@PathVariable Long commentId,
                                                                                              @RequestParam(required = false) LocalDateTime lastDate,
                                                                                              @RequestParam(required = false) Long lastId,
                                                                                              @RequestParam(defaultValue = "10") int size) throws UserNotFoundByUsernameException {

        var page = postCommentService.getPaginatedCommentRepliesByCommentId(commentId, lastDate, lastId, size);
        return ResponseEntity.ok(page);
    }

    @PostMapping("/post/{postId}/comments")
    public ResponseEntity<Void> addPostComment(@PathVariable Long postId, @Valid @RequestBody PostCommentDto dto) throws PostNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        postCommentService.addComment(postId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/post/comments/{commentId}")
    public ResponseEntity<Void> deletePostComment(@PathVariable Long commentId) throws CommentAccessException, UserNotFoundByUsernameException, CommentDeletedException {
        postCommentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/post/comments/{commentId}")
    public ResponseEntity<Void> editPostComment(@PathVariable Long commentId, @Valid @RequestBody PostCommentDto dto) throws CommentAccessException, InvalidForumContentException, UserNotFoundByUsernameException, CommentDeletedException {
        postCommentService.editComment(commentId, dto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/comments/{commentId}/vote")
    public ResponseEntity<Void> votePostComment(@PathVariable Long commentId, @RequestParam boolean isUpvote) throws CommentNotFoundException, UserNotFoundByUsernameException, CommentDeletedException {
        postCommentService.voteComment(commentId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/comments/{commentId}/report")
    public ResponseEntity<Void> reportPost(@PathVariable Long commentId, @Valid @RequestBody ForumReportDto report) throws CommentNotFoundException, UserNotFoundByUsernameException, ContentAlreadyReportedException, OwnContentReportException {
        postCommentService.reportComment(commentId, report);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/comments/{commentId}/replies")
    public ResponseEntity<Void> addReplyPostComment(@PathVariable Long commentId, @Valid @RequestBody PostCommentDto dto) throws CommentNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException, InvalidCommentOperationException, PostNotFoundException {
        postCommentService.addReplyToComment(commentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
