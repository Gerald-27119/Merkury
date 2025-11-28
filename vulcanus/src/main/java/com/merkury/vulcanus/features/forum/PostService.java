package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.*;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.mappers.forum.CategoryMapper;
import com.merkury.vulcanus.model.mappers.forum.TagMapper;
import com.merkury.vulcanus.model.mappers.forum.PostMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.forum.PostCategoryRepository;
import com.merkury.vulcanus.model.repositories.forum.PostRepository;
import com.merkury.vulcanus.model.repositories.forum.PostTagRepository;
import com.merkury.vulcanus.model.specification.PostSpecification;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.utils.ForumContentValidator;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserEntityRepository userRepository;
    private final PostCategoryRepository postCategoryRepository;
    private final PostTagRepository postTagRepository;
    private final VoteService voteService;
    private final ReportService reportService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserEntityFetcher userEntityFetcher;
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

    public Page<PostGeneralDto> getFollowedPostsPage(Pageable pageable) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var posts = postRepository.findAllFollowedPosts(user.getId(), pageable);

        return posts.map(post -> PostMapper.toGeneralDto(post, user));
    }

    public Page<PostGeneralDto> getSearchedPostsPage(Pageable pageable, String phrase, String category, List<String> tags, LocalDate fromDate, LocalDate toDate, String author) throws UserNotFoundByUsernameException {
        Specification<Post> spec = Specification.where(PostSpecification.hasPhrase(phrase))
                .and(PostSpecification.hasCategory(category))
                .and(PostSpecification.hasTags(tags))
                .and(PostSpecification.hasFromDate(fromDate))
                .and(PostSpecification.hasToDate(toDate))
                .and(PostSpecification.hasAuthor(author));

        Page<Post> postsPage = postRepository.findAll(spec, pageable);
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        return postsPage.map(post -> PostMapper.toGeneralDto(post, user));
    }

    public List<String> searchPosts(String phrase) {
        List<Post> searchResults = postRepository.findTop10ByTitleContainingIgnoreCase(phrase);

        return searchResults.stream().map(Post::getTitle).toList();
    }

    public List<TrendingPostDto> getTrendingPosts(Pageable pageable) {
        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        List<Post> trending = postRepository.findTopTrendingPosts(monthAgo, pageable);

        return trending.stream().map(PostMapper::toTrendingDto).toList();
    }

    public void addPost(PostDto dto) throws CategoryNotFoundException, TagNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var category = getCategoryByName(dto.category());
        var tags = getTagsByNames(dto.tags());

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
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

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());

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

    public void followPost(Long postId) throws PostNotFoundException, UserNotFoundByUsernameException, InvalidPostOperationException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        if (post.getAuthor().equals(user)) {
            throw new InvalidPostOperationException("You can't follow your own post.");
        }

        toggleFollower(post, user);
        userRepository.save(user);
    }

    public void reportPost(Long postId, ForumReportDto report) throws PostNotFoundException, UserNotFoundByUsernameException, ContentAlreadyReportedException, OwnContentReportException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        reportService.reportPost(report, post, user);
    }

    @Transactional
    public void increasePostViews(Long postId) throws PostNotFoundException {
        int updated = postRepository.incrementViews(postId);
        if (updated == 0) throw new PostNotFoundException(postId);
    }


    public ForumCategoriesAndTagsDto getAllCategoriesAndTags() {
        var categories = postCategoryRepository.findAll();
        var tags = postTagRepository.findAll();

        return new ForumCategoriesAndTagsDto(categories.stream().map(CategoryMapper::toDto).toList(), tags.stream().map(TagMapper::toDto).toList());
    }

    public List<PostCategoryDto> getAllCategoriesAlphabetically() {
        var categories = postCategoryRepository.findAllByOrderByNameAsc();
        return categories.stream().map(CategoryMapper::toDto).toList();
    }

    public List<PostTagDto> getAllTagsAlphabetically() {
        var tags = postTagRepository.findAllByOrderByNameAsc();
        return tags.stream().map(TagMapper::toDto).toList();
    }

    private PostCategory getCategoryByName(String name) throws CategoryNotFoundException {
        return postCategoryRepository.findByName(name)
                .orElseThrow(() -> new CategoryNotFoundException(name));
    }

    private Set<Tag> getTagsByNames(List<String> tagNames) throws TagNotFoundException {
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            Tag tag = postTagRepository.findByName(tagName)
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

    private void toggleFollower(Post post, UserEntity user) {
        var followed = user.getFollowedPosts();

        if (followed.contains(post)) {
            followed.remove(post);
        } else {
            followed.add(post);
        }
    }

}
