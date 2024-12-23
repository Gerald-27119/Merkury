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

        dto.setAuthor(comment.getAuthor() != null ? comment.getAuthor().getUsername() : null);

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

        return comment;
    }

    // Mapper: List<Comment> -> List<CommentDto>
    public static List<CommentDto> toDtoList(List<Comment> comments) {
        return comments.stream()
                .map(CommentMapper::toDto)
                .collect(Collectors.toList());
    }

    // Mapper: List<CommentDto> -> List<Comment>
    public static List<Comment> toEntityList(List<CommentDto> dtos, Spot spot, UserEntity author) {
        return dtos.stream()
                .map(dto -> toEntity(dto, spot, author))
                .collect(Collectors.toList());
    }
}

