package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.CommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CommentMapper {
    private CommentMapper() {
    }

    public static CommentDto toDto(@NotNull Comment comment, UserEntity currentUser) {
        return CommentDto.builder()
                .id(comment.getId())
                .text(comment.getText())
                .rating(comment.getRating())
                .upvotes(comment.getUpvotes())
                .downvotes(comment.getDownvotes())
                .publishDate(comment.getPublishDate())
                .author(comment.getAuthor().getUsername())
                .isAuthor(comment.getAuthor().equals(currentUser))
                .build();
    }

    public static Comment toEntity(@NotNull CommentDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return Comment.builder()
                .id(dto.id())
                .text(dto.text())
                .rating(dto.rating())
                .upvotes(dto.upvotes())
                .downvotes(dto.downvotes())
                .spot(spot)
                .author(author)
                .publishDate(dto.publishDate())
                .build();
    }

    public static Comment toEntity(@NotNull CommentAddDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return Comment.builder()
                .text(dto.text())
                .rating(dto.rating())
                .spot(spot)
                .publishDate(LocalDateTime.now())
                .author(author)
                .build();
    }
}

