package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.CategoryNotFoundException;
import com.merkury.vulcanus.exception.exceptions.PostAccessException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.exception.exceptions.TagNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.entities.forum.Category;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.mappers.CategoryMapper;
import com.merkury.vulcanus.model.mappers.PostMapper;
import com.merkury.vulcanus.model.repositories.CategoryRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import com.merkury.vulcanus.model.repositories.TagRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserDataService userDataService;
    private final VoteService voteService;

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

    //TODO: use jsoup library for content filter
    public void addPost(HttpServletRequest request, PostDto dto) throws CategoryNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var category = getCategoryByName(dto.category().name());
        var tags = getTagsByNames(dto.tags());

        postRepository.save(PostMapper.toEntity(dto, user, category, tags));
    }

    public void deletePost(HttpServletRequest request, Long postId) throws PostAccessException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new PostAccessException("delete"));

        postRepository.delete(post);
    }

    //TODO: use jsoup library for content filter
    public void editPost(HttpServletRequest request, Long postId, PostDto dto) throws PostAccessException, CategoryNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new PostAccessException("edit"));
        var category = getCategoryByName(dto.category().name());
        var tags = getTagsByNames(dto.tags());

        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setCategory(category);
        post.setTags(tags);

        postRepository.save(post);
    }

    public void votePost(HttpServletRequest request, Long postId, boolean isUpvote) throws PostNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        voteService.vote(post, user, isUpvote);
        postRepository.save(post);
    }

    public CategoriesAndTagsDto getAllCategoriesAndTags() {
        var categories = categoryRepository.findAll();
        var tags = tagRepository.findAll();

        return new CategoriesAndTagsDto(categories.stream().map(CategoryMapper::toDto).toList(), tags.stream().map(Tag::getName).toList());
    }

    private Category getCategoryByName(String name) throws CategoryNotFoundException {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new CategoryNotFoundException(name));
    }
    private Set<Tag> getTagsByNames(List<String> tagNames) {
        return tagNames.stream()
                .map(tagName -> tagRepository.findByName(tagName)
                        .orElseThrow(() -> new TagNotFoundException(tagName)))
                .collect(Collectors.toSet());
    }
}
