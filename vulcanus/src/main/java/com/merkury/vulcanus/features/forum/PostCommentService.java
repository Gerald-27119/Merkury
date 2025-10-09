package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.ForumPostCommentReplyPageDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.mappers.forum.PostCommentMapper;
import com.merkury.vulcanus.model.repositories.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.utils.ForumContentValidator;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserEntityFetcher userEntityFetcher;
    private final VoteService voteService;
    private final ForumContentValidator forumContentValidator;

    public Page<PostCommentGeneralDto> getCommentsByPostId(Pageable pageable, Long postId) throws UserNotFoundByUsernameException {
        Page<PostComment> comments = postCommentRepository.findAllByPost_IdAndParentIsNull(postId, pageable);
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        return comments.map(comment -> PostCommentMapper.toDto(comment, user, true));
    }

    public ForumPostCommentReplyPageDto getCommentRepliesByCommentId(Long parentCommentId, LocalDateTime lastDate, Long lastId, int size) throws UserNotFoundByUsernameException {
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        var replies = postCommentRepository.findRepliesRecursiveKeyset(parentCommentId, lastDate, lastId, size);
        var dtos = PostCommentMapper.toDto(replies, user, false);

        var nextCursor = dtos.isEmpty() ? null : dtos.getLast().id();

        return new ForumPostCommentReplyPageDto(dtos, nextCursor);
    }

    public void addComment(Long postId, PostCommentDto dto) throws PostNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        var commentEntity = PostCommentMapper.toEntity(cleanContent, post, user);

        postCommentRepository.save(commentEntity);
        updateNumberOfComments(post, true);
    }

    public void deleteComment(Long commentId) throws CommentAccessException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("delete"));
        var post = comment.getPost();

        postCommentRepository.delete(comment);
        updateNumberOfComments(post, false);
    }

    public void editComment(Long commentId, PostCommentDto dto) throws CommentAccessException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("edit"));

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        comment.setContent(cleanContent);

        postCommentRepository.save(comment);
    }

    public void voteComment(Long commentId, boolean isUpvote) throws CommentNotFoundException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));

        voteService.vote(comment, user, isUpvote);
        postCommentRepository.save(comment);
    }

    public void addReplyToComment(Long parentCommentId, PostCommentDto dto) throws CommentNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException, InvalidCommentOperationException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var parentComment = postCommentRepository.findById(parentCommentId).orElseThrow(() -> new CommentNotFoundException(parentCommentId));

        if (parentComment.getAuthor().equals(user)) {
            throw new InvalidCommentOperationException();
        }

        var post = parentComment.getPost();

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        var commentEntity = PostCommentMapper.toEntity(cleanContent, parentComment, user);

        parentComment.getReplies().add(commentEntity);
        postCommentRepository.save(commentEntity);
        updateNumberOfComments(post, true);
    }

    private void updateNumberOfComments(Post post, boolean isAdding) {
        var newCommentCount = post.getCommentsCount();
        post.setCommentsCount(isAdding ? newCommentCount + 1 : newCommentCount - 1);
        postRepository.save(post);
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
