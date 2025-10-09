package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.forum.PostService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.enums.forum.ForumPostSortField;
import com.merkury.vulcanus.model.enums.forum.SortDirection;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/public/post/{postId}")
    public ResponseEntity<PostDetailsDto> getDetailedPost(@PathVariable Long postId) throws PostNotFoundException, UserNotFoundByUsernameException {
        return ResponseEntity.ok(postService.getDetailedPost(postId));
    }

    @GetMapping("/public/post")
    public ResponseEntity<Page<PostGeneralDto>> getPostsPage(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(defaultValue = "PUBLISH_DATE") ForumPostSortField sortBy,
                                                             @RequestParam(defaultValue = "DESC") SortDirection sortDirection) throws UserNotFoundByUsernameException {
        Page<PostGeneralDto> posts = postService.getPostsPage(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection.name()), sortBy.getField())));

        return ResponseEntity.ok(posts);
    }

    @PostMapping("/post")
    public ResponseEntity<Void> addPost(@Valid @RequestBody PostDto post) throws CategoryNotFoundException, TagNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        postService.addPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("post/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) throws UnauthorizedPostAccessException, UserNotFoundByUsernameException {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("post/{postId}")
    public ResponseEntity<Void> editPost(@PathVariable Long postId, @Valid @RequestBody PostDto post) throws UnauthorizedPostAccessException, CategoryNotFoundException, TagNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        postService.editPost(postId, post);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/{postId}/vote")
    public ResponseEntity<Void> votePost(@PathVariable Long postId, @RequestParam boolean isUpvote) throws PostNotFoundException, UserNotFoundByUsernameException {
        postService.votePost(postId, isUpvote);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/public/categories-tags")
    public ResponseEntity<ForumCategoriesAndTagsDto> getAllCategoriesAndTags() {
        return ResponseEntity.ok(postService.getAllCategoriesAndTags());
    }
}
