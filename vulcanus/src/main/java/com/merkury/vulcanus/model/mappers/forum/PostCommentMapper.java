package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.PostCommentGeneralDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class PostCommentMapper {

    private PostCommentMapper() {
    }

    public static PostCommentGeneralDto toDto(@NotNull PostComment postComment, UserEntity currentUser, Integer repliesCount) {
        return PostCommentGeneralDto.builder()
                .id(postComment.getId())
                .content(postComment.getContent())
                .upVotes(postComment.getUpVotes())
                .downVotes(postComment.getDownVotes())
                .publishDate(postComment.getPublishDate())
                .author(AuthorMapper.toDto(postComment.getAuthor()))
                .isAuthor(postComment.getAuthor().equals(currentUser))
                .isUpVoted(postComment.getUpVotedBy().contains(currentUser))
                .isDownVoted(postComment.getDownVotedBy().contains(currentUser))
                .isReply(postComment.getParent() != null)
                .repliesCount(repliesCount)
                .build();
    }

    public static List<PostCommentGeneralDto> toDto(List<PostComment> comments, UserEntity currentUser) {
        return comments.stream()
                .map(comment -> toDto(comment, currentUser, null))
                .toList();
    }

    public static PostComment toEntity(@NotNull String cleanContent, @NotNull Post post, @NotNull UserEntity author) {
        return PostComment.builder()
                .author(author)
                .publishDate(LocalDateTime.now())
                .content(cleanContent)
                .post(post)
                .build();
    }

    public static PostComment toEntity(@NotNull String cleanContent, @NotNull PostComment parentComment, @NotNull UserEntity author) {
        return PostComment.builder()
                .author(author)
                .publishDate(LocalDateTime.now())
                .content(cleanContent)
                .parent(parentComment)
                .post(parentComment.getPost())
                .build();
    }
}
