package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.PostCommentDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PostCommentMapper {

    private PostCommentMapper() {}

    public static PostCommentDto toDto(@NotNull PostComment postComment, @NotNull UserEntity currentUser) {
        return PostCommentDto.builder()
                .id(postComment.getId())
                .content(postComment.getContent())
                .upvotes(postComment.getUpvotes())
                .downvotes(postComment.getDownvotes())
                .publishDate(postComment.getPublishDate())
                .author(postComment.getAuthor().getUsername())
                .isAuthor(postComment.getAuthor().equals(currentUser))
                .isUpvoted(postComment.getUpvotedBy().contains(currentUser))
                .isDownvoted(postComment.getDownvotedBy().contains(currentUser))
                .build();
    }

    public static List<PostCommentDto> toDto(List<PostComment> comments, UserEntity currentUser) {
        return comments.stream()
                .map(comment -> toDto(comment, currentUser))
                .toList();
    }


}
