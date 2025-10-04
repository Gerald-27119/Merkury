package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.PostCommentAddDto;
import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class PostCommentMapper {

    private PostCommentMapper() {}

    public static PostCommentDto toDto(@NotNull PostComment postComment, @NotNull UserEntity currentUser) {
        return PostCommentDto.builder()
                .id(postComment.getId())
                .content(postComment.getContent())
                .upvotes(postComment.getUpVotes())
                .downvotes(postComment.getDownVotes())
                .publishDate(postComment.getPublishDate())
                .author(postComment.getAuthor().getUsername())
                .isAuthor(postComment.getAuthor().equals(currentUser))
                .isUpVoted(postComment.getUpVotedBy().contains(currentUser))
                .isDownVoted(postComment.getDownVotedBy().contains(currentUser))
                .build();
    }

    public static List<PostCommentDto> toDto(List<PostComment> comments, UserEntity currentUser) {
        return comments.stream()
                .map(comment -> toDto(comment, currentUser))
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


}
