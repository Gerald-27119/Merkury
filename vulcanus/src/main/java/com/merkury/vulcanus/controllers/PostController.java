package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.PostAccessException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.features.forum.PostService;
import com.merkury.vulcanus.model.dtos.forum.*;
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
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<PostDetailsDto> getDetailedPost(HttpServletRequest request, @PathVariable Long postId) throws PostNotFoundException {
        return ResponseEntity.ok(postService.getDetailedPost(request, postId));
    }

    @GetMapping
    public ResponseEntity<Page<PostGeneralDto>> getPostsPage(HttpServletRequest request, @RequestParam(defaultValue = "0") int page) {
        int defaultPageSize = 5;
        Page<PostGeneralDto> posts = postService.getPostsPage(request, PageRequest.of(page, defaultPageSize));

        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<Void> addPost(HttpServletRequest request, @Valid @RequestBody PostDto post) {
        postService.addPost(request, post);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePost(HttpServletRequest request, @PathVariable Long postId) throws PostAccessException {
        postService.deletePost(request, postId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping
    public ResponseEntity<Void> editPost(HttpServletRequest request, @PathVariable Long postId, @Valid @RequestBody PostDto post) throws PostAccessException {
        postService.editPost(request, postId, post);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping
    public ResponseEntity<Void> votePost(HttpServletRequest request, @PathVariable Long postId, @RequestParam boolean isUpvote) {
        postService.votePost(request, postId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
