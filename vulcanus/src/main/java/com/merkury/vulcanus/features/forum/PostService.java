package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.PostAccessException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.mappers.PostMapper;
import com.merkury.vulcanus.model.repositories.PostRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserDataService userDataService;

    public PostDetailsDto getDetailedPost(HttpServletRequest request, Long postId) throws PostNotFoundException {
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return PostMapper.toDetailsDto(post, user);
    }

    public Page<PostGeneralDto> getPostsPage(HttpServletRequest request, Pageable pageable) {
        Page<Post> postsPage = postRepository.findAll(
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(Sort.Direction.ASC, "publishDate")
                )
        );
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return postsPage.map(post -> PostMapper.toGeneralDto(post, user));
    }

    public void addPost(HttpServletRequest request, PostDto dto) {

    }

    public void deletePost(HttpServletRequest request, Long postId) throws PostAccessException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new PostAccessException("delete"));

        postRepository.delete(post);
    }

    public void editPost(HttpServletRequest request, Long postId, PostDto dto) throws PostAccessException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new PostAccessException("edit"));

        post.setTitle(dto.title());
        post.setContent(dto.content());

        postRepository.save(post);
    }

    public void votePost(HttpServletRequest request, Long postId, boolean isUpvote) {
    }

}
