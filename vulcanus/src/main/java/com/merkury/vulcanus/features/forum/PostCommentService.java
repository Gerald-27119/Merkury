package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.ForumPostCommentReplyPageDto;
import com.merkury.vulcanus.model.dtos.forum.ForumReportDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.mappers.forum.PostCommentMapper;
import com.merkury.vulcanus.model.repositories.forum.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.forum.PostRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.utils.forum.ForumContentValidator;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;

import java.net.URISyntaxException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserEntityFetcher userEntityFetcher;
    private final VoteService voteService;
    private final ReportService reportService;
    private final ForumMediaService forumMediaService;
    private final ForumContentValidator forumContentValidator;

    public Page<PostCommentGeneralDto> getPaginatedCommentsByPostId(Pageable pageable, Long postId) throws UserNotFoundByUsernameException {
        Page<PostComment> comments = postCommentRepository.findAllByPost_IdAndParentIsNull(postId, pageable);
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        return comments.map(comment -> {
            int repliesCount = postCommentRepository.countAllReplies(comment.getId());
            return PostCommentMapper.toDto(comment, user, repliesCount);
        });

    }

    public ForumPostCommentReplyPageDto getPaginatedCommentRepliesByCommentId(Long parentCommentId, LocalDateTime lastDate, Long lastId, int size) throws UserNotFoundByUsernameException {
        var userName = getAuthenticatedUsernameOrNull();
        var user = userName != null ? userEntityFetcher.getByUsername(userName) : null;

        var replies = postCommentRepository.findRepliesRecursiveKeyset(parentCommentId, lastDate, lastId, size + 1);

        Long nextCursorId = null;
        LocalDateTime nextCursorDate = null;
        if (replies.size() > size) {
            var next = replies.get(size);
            nextCursorId = next.getId();
            nextCursorDate = next.getPublishDate();
            replies = replies.subList(0, size);
        }

        var dtos = PostCommentMapper.toDto(replies, user);

        return new ForumPostCommentReplyPageDto(dtos, nextCursorId, nextCursorDate);
    }

    @Transactional
    public void addComment(Long postId, PostCommentDto dto) throws PostNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        var commentEntity = PostCommentMapper.toEntity(cleanContent, post, user);

        postCommentRepository.save(commentEntity);
        forumMediaService.savePostCommentMedia(cleanContent, commentEntity);
        updateCommentsCount(post.getId());
    }

    public void deleteComment(Long commentId) throws CommentAccessException, UserNotFoundByUsernameException, CommentDeletedException, BlobContainerNotFoundException, URISyntaxException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("delete"));

        throwIfCommentDeleted(comment);
        comment.setContent("<p>Comment was deleted by the user.</p>");
        comment.setIsDeleted(true);
        forumMediaService.deletePostCommentMedia(commentId);
        postCommentRepository.save(comment);
    }

    public void editComment(Long commentId, PostCommentDto dto) throws CommentAccessException, InvalidForumContentException, UserNotFoundByUsernameException, CommentDeletedException, BlobContainerNotFoundException, URISyntaxException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("edit"));

        throwIfCommentDeleted(comment);
        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        comment.setContent(cleanContent);

        forumMediaService.editPostCommentMedia(cleanContent, comment);
        postCommentRepository.save(comment);
    }

    public void voteComment(Long commentId, boolean isUpvote) throws CommentNotFoundException, UserNotFoundByUsernameException, CommentDeletedException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        throwIfCommentDeleted(comment);
        voteService.vote(comment, user, isUpvote);
        postCommentRepository.save(comment);
    }

    public void reportComment(Long commentId, ForumReportDto report) throws CommentNotFoundException, UserNotFoundByUsernameException, ContentAlreadyReportedException, OwnContentReportException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var comment = postCommentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        reportService.reportPostComment(report, comment, user);
    }

    @Transactional
    public void addReplyToComment(Long parentCommentId, PostCommentDto dto) throws CommentNotFoundException, InvalidForumContentException, UserNotFoundByUsernameException, InvalidCommentOperationException, PostNotFoundException {
        var user = userEntityFetcher.getByUsername(getAuthenticatedUsernameOrNull());
        var parentComment = postCommentRepository.findById(parentCommentId).orElseThrow(() -> new CommentNotFoundException(parentCommentId));

        if (parentComment.getAuthor().equals(user)) {
            throw new InvalidCommentOperationException("You cannot reply to your own comment.");
        }

        var postId = parentComment.getPost().getId();

        var cleanContent = forumContentValidator.sanitizeAndValidateContent(dto.content());
        var commentEntity = PostCommentMapper.toEntity(cleanContent, parentComment, user);

        postCommentRepository.save(commentEntity);
        updateCommentsCount(postId);
        updateRepliesCount(parentCommentId);
    }

    private void updateRepliesCount(Long commentId) throws CommentNotFoundException {
        int updated = postCommentRepository.incrementRepliesCount(commentId);
        if (updated == 0) throw new CommentNotFoundException(commentId);
    }

    private void updateCommentsCount(Long postId) throws PostNotFoundException {
        int updated = postRepository.incrementCommentsCount(postId);
        if (updated == 0) throw new PostNotFoundException(postId);
    }

    private void throwIfCommentDeleted(PostComment comment) throws CommentDeletedException {
        if (comment.getIsDeleted()) {
            throw new CommentDeletedException(comment.getId().toString());
        }
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
