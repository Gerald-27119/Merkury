package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.coment.CommentDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

public class CommentMapper {
    private CommentMapper() {
    }

    public static CommentDto toDto(@NotNull Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getText(),
                comment.getRating(),
                comment.getLikes(),
                comment.getPublishDate(),
                comment.getAuthor().getUsername());
    }

    public static Comment toEntity(@NotNull CommentDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        Comment comment = new Comment();
        comment.setId(dto.id());
        comment.setText(dto.text());
        comment.setRating(dto.rating());
        comment.setLikes(dto.likes());
        comment.setSpot(spot);
        comment.setAuthor(author);
        comment.setPublishDate(dto.publishDate());

        return comment;
    }
}

