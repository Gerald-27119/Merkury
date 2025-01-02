package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;

import java.util.List;
import java.util.stream.Collectors;

public class CommentMapper {

    public static CommentDto toDto(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setRating(comment.getRating());
        dto.setLikes(comment.getLikes());
        dto.setAuthor(comment.getAuthor().getUsername());
        dto.setPublishDate(comment.getPublishDate());

        return dto;
    }

    public static Comment toEntity(CommentDto dto, Spot spot, UserEntity author) {
        if (dto == null) {
            return null;
        }

        Comment comment = new Comment();
        comment.setId(dto.getId());
        comment.setText(dto.getText());
        comment.setRating(dto.getRating());
        comment.setLikes(dto.getLikes());
        comment.setSpot(spot);
        comment.setAuthor(author);
        comment.setPublishDate(dto.getPublishDate());

        return comment;
    }
}

