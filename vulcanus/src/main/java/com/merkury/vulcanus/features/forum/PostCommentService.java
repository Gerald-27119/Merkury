package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.PostNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.features.jsoup.JsoupSanitizer;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.forum.ForumPostCommentReplyPageDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.mappers.forum.PostCommentMapper;
import com.merkury.vulcanus.model.repositories.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import com.merkury.vulcanus.utils.JsoupSanitizerConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final UserDataService userDataService;
    private final VoteService voteService;
    private final JsoupSanitizerConfig jsoupSafeLists;
    private final JsoupSanitizer sanitizer;

    public Page<PostCommentGeneralDto> getCommentsByPostId(HttpServletRequest request, Pageable pageable, Long postId) throws UserNotFoundException {
        Page<PostComment> comments = postCommentRepository.findAllByPost_IdAndParentIsNull(postId, pageable);
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return comments.map(comment -> PostCommentMapper.toDto(comment, user));
    }

    public ForumPostCommentReplyPageDto getCommentRepliesByCommentId(HttpServletRequest request, Long parentCommentId, LocalDateTime lastDate, Long lastId, int size) throws UserNotFoundException {
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        List<PostComment> replies = postCommentRepository.findRepliesRecursiveKeyset(parentCommentId, lastDate, lastId, size);
        List<PostCommentGeneralDto> dtos = PostCommentMapper.toDto(replies, user);

        Long nextCursor = dtos.isEmpty() ? null : dtos.getLast().id();

        return new ForumPostCommentReplyPageDto(dtos, nextCursor);
    }

    public void addComment(HttpServletRequest request, Long postId, PostCommentDto dto) throws UserNotFoundException, PostNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        var cleanContent = sanitizer.clean(dto.content(), jsoupSafeLists.forumSafeList());

        var commentEntity = PostCommentMapper.toEntity(cleanContent, post, user);

        postCommentRepository.save(commentEntity);
    }

    @Transactional
    public void deleteComment(HttpServletRequest request, Long commentId) throws UserNotFoundException, CommentAccessException {
        var user = userDataService.getUserFromRequest(request);
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("delete"));

        postCommentRepository.delete(comment);
    }

    public void editComment(HttpServletRequest request, Long commentId, PostCommentDto dto) throws UserNotFoundException, CommentAccessException {
        var user = userDataService.getUserFromRequest(request);
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("edit"));

        var cleanContent = sanitizer.clean(dto.content(), jsoupSafeLists.forumSafeList());
        comment.setContent(cleanContent);

        postCommentRepository.save(comment);
    }

    public void voteComment(HttpServletRequest request, Long commentId, boolean isUpvote) throws CommentNotFoundException, UserNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var comment = postCommentRepository.findByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentNotFoundException(commentId));

        voteService.vote(comment, user, isUpvote);
        postCommentRepository.save(comment);
    }

    public void addReplyToComment(HttpServletRequest request, Long parentCommentId, PostCommentDto dto) throws UserNotFoundException, CommentNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var parentComment = postCommentRepository.findById(parentCommentId).orElseThrow(() -> new CommentNotFoundException(parentCommentId));

        var cleanContent = sanitizer.clean(dto.content(), jsoupSafeLists.forumSafeList());
        var commentEntity = PostCommentMapper.toEntity(cleanContent, parentComment, user);

        parentComment.getReplies().add(commentEntity);
        postCommentRepository.save(commentEntity);
    }

}
