package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.CategoryNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UnauthorizedPostAccessException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.exception.exceptions.TagNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.mappers.forum.mappers.CategoryMapper;
import com.merkury.vulcanus.model.mappers.forum.mappers.TagMapper;
import com.merkury.vulcanus.model.mappers.forum.mappers.PostMapper;
import com.merkury.vulcanus.model.repositories.PostCategoryRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import com.merkury.vulcanus.model.repositories.TagRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostCategoryRepository postCategoryRepository;
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
    public void addPost(HttpServletRequest request, PostDto dto) throws CategoryNotFoundException, TagNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var category = getCategoryByName(dto.category());
        var tags = getTagsByNames(dto.tags());

        postRepository.save(PostMapper.toEntity(dto, user, category, tags));
    }

    @Transactional
    public void deletePost(HttpServletRequest request, Long postId) throws UnauthorizedPostAccessException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new UnauthorizedPostAccessException("delete"));

        postRepository.delete(post);
    }

    //TODO: use jsoup library for content filter
    public void editPost(HttpServletRequest request, Long postId, PostDto dto) throws UnauthorizedPostAccessException, CategoryNotFoundException, TagNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new UnauthorizedPostAccessException("edit"));
        var category = getCategoryByName(dto.category());
        var tags = getTagsByNames(dto.tags());

        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setPostCategory(category);
        post.setTags(tags);

        postRepository.save(post);
    }

    public void votePost(HttpServletRequest request, Long postId, boolean isUpvote) throws PostNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        voteService.vote(post, user, isUpvote);
        postRepository.save(post);
    }

    public ForumCategoriesAndTagsDto getAllCategoriesAndTags() {
        var categories = postCategoryRepository.findAll();
        var tags = tagRepository.findAll();

        return new ForumCategoriesAndTagsDto(categories.stream().map(CategoryMapper::toDto).toList(), tags.stream().map(TagMapper::toDto).toList());
    }

    private PostCategory getCategoryByName(String name) throws CategoryNotFoundException {
        return postCategoryRepository.findByName(name)
                .orElseThrow(() -> new CategoryNotFoundException(name));
    }
    private Set<Tag> getTagsByNames(List<String> tagNames) throws TagNotFoundException {
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseThrow(() -> new TagNotFoundException(tagName));
            tags.add(tag);
        }
        return tags;
    }

}
