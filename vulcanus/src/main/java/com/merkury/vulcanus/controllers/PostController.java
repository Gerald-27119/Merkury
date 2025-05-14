package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CategoryNotFoundException;
import com.merkury.vulcanus.exception.exceptions.TagNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UnauthorizedPostAccessException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.features.forum.PostService;
import com.merkury.vulcanus.model.dtos.forum.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/public/post/{postId}")
    public ResponseEntity<PostDetailsDto> getDetailedPost(HttpServletRequest request, @PathVariable Long postId) throws PostNotFoundException {
        return ResponseEntity.ok(postService.getDetailedPost(request, postId));
    }

    @GetMapping("/public/post")
    public ResponseEntity<Page<PostGeneralDto>> getPostsPage(HttpServletRequest request, @RequestParam(defaultValue = "0") int page) {
        int defaultPageSize = 5;
        Page<PostGeneralDto> posts = postService.getPostsPage(request, PageRequest.of(page, defaultPageSize));

        return ResponseEntity.ok(posts);
    }

    @PostMapping("/post")
    public ResponseEntity<Void> addPost(HttpServletRequest request, @Valid @RequestBody PostDto post) throws CategoryNotFoundException, TagNotFoundException {
        postService.addPost(request, post);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("post/{postId}")
    public ResponseEntity<Void> deletePost(HttpServletRequest request, @PathVariable Long postId) throws UnauthorizedPostAccessException {
        postService.deletePost(request, postId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("post/{postId}")
    public ResponseEntity<Void> editPost(HttpServletRequest request, @PathVariable Long postId, @Valid @RequestBody PostDto post) throws UnauthorizedPostAccessException, CategoryNotFoundException, TagNotFoundException {
        postService.editPost(request, postId, post);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/{postId}/vote")
    public ResponseEntity<Void> votePost(HttpServletRequest request, @PathVariable Long postId, @RequestParam boolean isUpvote) throws PostNotFoundException {
        postService.votePost(request, postId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/categories-tags")
    public ResponseEntity<CategoriesAndTagsDto> getAllCategoriesAndTags(){
       return ResponseEntity.ok(postService.getAllCategoriesAndTags());
    }
}
