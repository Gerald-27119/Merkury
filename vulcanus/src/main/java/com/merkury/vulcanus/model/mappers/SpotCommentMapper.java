package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.comment.SpotCommentAddDto;
import com.merkury.vulcanus.model.dtos.comment.SpotCommentDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class SpotCommentMapper {
    private SpotCommentMapper() {
    }

    public static SpotCommentDto toDto(@NotNull SpotComment spotComment, UserEntity currentUser) {
        return SpotCommentDto.builder()
                .id(spotComment.getId())
                .text(spotComment.getText())
                .rating(spotComment.getRating())
                .upvotes(spotComment.getUpVotes())
                .downvotes(spotComment.getDownVotes())
                .publishDate(spotComment.getPublishDate())
                .author(spotComment.getAuthor().getUsername())
                .isAuthor(currentUser != null && spotComment.getAuthor().getId().equals(currentUser.getId()))
                .isUpVoted(spotComment.getUpVotedBy().contains(currentUser))
                .isDownVoted(spotComment.getDownVotedBy().contains(currentUser))
                .build();
    }

    public static SpotComment toEntity(@NotNull SpotCommentDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return SpotComment.builder()
                .id(dto.id())
                .text(dto.text())
                .rating(dto.rating())
                .upVotes(dto.upvotes())
                .downVotes(dto.downvotes())
                .spot(spot)
                .author(author)
                .publishDate(dto.publishDate())
                .build();
    }

    public static SpotComment toEntity(@NotNull SpotCommentAddDto dto, @NotNull Spot spot, @NotNull UserEntity author) {
        return SpotComment.builder()
                .text(dto.text())
                .rating(dto.rating())
                .spot(spot)
                .publishDate(LocalDateTime.now())
                .author(author)
                .build();
    }
}

