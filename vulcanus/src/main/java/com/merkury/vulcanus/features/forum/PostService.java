package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.jsoup.JsoupSanitizer;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.mappers.forum.CategoryMapper;
import com.merkury.vulcanus.model.mappers.forum.TagMapper;
import com.merkury.vulcanus.model.mappers.forum.PostMapper;
import com.merkury.vulcanus.model.repositories.PostCategoryRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import com.merkury.vulcanus.model.repositories.TagRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.utils.ForumContentValidator;
import com.merkury.vulcanus.utils.JsoupSanitizerConfig;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
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
    private final VoteService voteService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserEntityFetcher userEntityFetcher;
    private final JsoupSanitizerConfig jsoupSafeLists;
    private final JsoupSanitizer sanitizer;
    private final ForumContentValidator forumContentValidator;


    public PostDetailsDto getDetailedPost(Long postId) throws PostNotFoundException, UserNotFoundByUsernameException {
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        return PostMapper.toDetailsDto(post, user);
    }

    public Page<PostGeneralDto> getPostsPage(Pageable pageable) throws UserNotFoundByUsernameException {
        Page<Post> postsPage = postRepository.findAll(pageable);
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        return postsPage.map(post -> PostMapper.toGeneralDto(post, user));
    }

    public void addPost(PostDto dto) throws CategoryNotFoundException, TagNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var category = getCategoryByName(dto.category());
        var tags = getTagsByNames(dto.tags());

        var cleanContent = sanitizer.clean(dto.content(), jsoupSafeLists.forumSafeList());
        forumContentValidator.validateContentLength(cleanContent);

        var postEntity = PostMapper.toEntity(dto, cleanContent, user, category, tags);

        postRepository.save(postEntity);
    }

    public void deletePost(Long postId) throws UnauthorizedPostAccessException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new UnauthorizedPostAccessException("delete"));

        postRepository.delete(post);
    }

    public void editPost(Long postId, PostDto dto) throws UnauthorizedPostAccessException, CategoryNotFoundException, TagNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findPostByIdAndAuthor(postId, user).orElseThrow(() -> new UnauthorizedPostAccessException("edit"));
        var category = getCategoryByName(dto.category());
        var tags = getTagsByNames(dto.tags());

        var cleanContent = sanitizer.clean(dto.content(), jsoupSafeLists.forumSafeList());
        forumContentValidator.validateContentLength(cleanContent);

        post.setTitle(dto.title());
        post.setContent(cleanContent);
        post.setPostCategory(category);
        post.setTags(tags);

        postRepository.save(post);
    }

    public void votePost(Long postId, boolean isUpvote) throws PostNotFoundException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
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

    private String getAuthenticatedUsernameOrNull() {
        String viewerUsername = null;
        try {
            viewerUsername = customUserDetailsService
                    .loadUserDetailsFromSecurityContext()
                    .getUsername();
        } catch (AuthenticationCredentialsNotFoundException | InsufficientAuthenticationException ignored) {
        }
        return viewerUsername;
    }
}
