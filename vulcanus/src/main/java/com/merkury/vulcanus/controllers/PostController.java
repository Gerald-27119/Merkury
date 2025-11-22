package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.forum.PostService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.enums.forum.PostSortField;
import com.merkury.vulcanus.model.enums.forum.SortDirection;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/public/post/{postId}")
    public ResponseEntity<PostDetailsDto> getDetailedPost(@PathVariable Long postId) throws PostNotFoundException, UserNotFoundByUsernameException {
        postService.increasePostViews(postId);
        return ResponseEntity.ok(postService.getDetailedPost(postId));
    }

    @GetMapping("/public/post")
    public ResponseEntity<Page<PostGeneralDto>> getPostsPage(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(defaultValue = "PUBLISH_DATE") PostSortField sortBy,
                                                             @RequestParam(defaultValue = "DESC") SortDirection sortDirection) throws UserNotFoundByUsernameException {
        Page<PostGeneralDto> posts = postService.getPostsPage(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection.name()), sortBy.getField())));

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/public/post/search")
    public ResponseEntity<Page<PostGeneralDto>> getSearchedPostsPage(@RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestParam(defaultValue = "PUBLISH_DATE") PostSortField sortBy,
                                                                     @RequestParam(defaultValue = "DESC") SortDirection sortDirection,
                                                                     @RequestParam(required = false) String searchPhrase,
                                                                     @RequestParam(required = false) String category,
                                                                     @RequestParam(required = false) List<String> tags,
                                                                     @RequestParam(required = false) LocalDate fromDate,
                                                                     @RequestParam(required = false) LocalDate toDate,
                                                                     @RequestParam(required = false) String author
    ) throws UserNotFoundByUsernameException {
        Page<PostGeneralDto> posts = postService.getSearchedPostsPage(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection.name()), sortBy.getField())), searchPhrase, category, tags, fromDate, toDate, author);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/public/post/search/hints/{searchPhrase}")
    public ResponseEntity<List<String>> searchPosts(@PathVariable String searchPhrase) {
        return ResponseEntity.ok(postService.searchPosts(searchPhrase));
    }

    @GetMapping("/public/post/trending")
    public ResponseEntity<List<TrendingPostDto>> getTrendingPosts(
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok(postService.getTrendingPosts(PageRequest.of(0, size)));
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

    @PatchMapping("/post/{postId}/follow")
    public ResponseEntity<Void> followPost(@PathVariable Long postId) throws PostNotFoundException, UserNotFoundByUsernameException, InvalidPostOperationException {
        postService.followPost(postId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/post/{postId}/report")
    public ResponseEntity<Void> reportPost(@PathVariable Long postId, @Valid @RequestBody ForumReportDto report) throws PostNotFoundException, UserNotFoundByUsernameException, ContentAlreadyReportedException, OwnContentReportException {
        postService.reportPost(postId, report);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/public/categories-tags")
    public ResponseEntity<ForumCategoriesAndTagsDto> getAllCategoriesAndTags() {
        return ResponseEntity.ok(postService.getAllCategoriesAndTags());
    }
}
