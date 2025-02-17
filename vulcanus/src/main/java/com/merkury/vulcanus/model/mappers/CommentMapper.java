package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class CommentMapper {
    private CommentMapper() {
    }

    public static CommentDto toDto(@NotNull Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .text(comment.getText())
                .rating(comment.getRating())
                .likes(comment.getLikes())
                .publishDate(comment.getPublishDate())
                .author(comment.getAuthor().getUsername())
                .build();
    }

    public static Comment toEntity(@NotNull CommentDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return Comment.builder()
                .id(dto.id())
                .text(dto.text())
                .rating(dto.rating())
                .likes(dto.likes())
                .spot(spot)
                .author(author)
                .publishDate(dto.publishDate())
                .build();
    }
}

