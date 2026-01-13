package com.merkury.vulcanus.model.mappers.spot;

import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentAddDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentMediaDto;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.spot.SpotCommentMedia;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Comparator;

public class SpotCommentMapper {
    private SpotCommentMapper() {
    }

    public static SpotCommentDto toDto(@NotNull SpotComment spotComment, UserEntity currentUser) {
        return SpotCommentDto.builder()
                .id(spotComment.getId())
                .text(spotComment.getText())
                .author(SpotCommentAuthorMapper.toDto(spotComment.getAuthor()))
                .rating(spotComment.getRating())
                .upvotes(spotComment.getUpVotes())
                .downvotes(spotComment.getDownVotes())
                .publishDate(spotComment.getPublishDate())
                .isUpVoted(spotComment.getUpVotedBy().contains(currentUser))
                .isDownVoted(spotComment.getDownVotedBy().contains(currentUser))
                .numberOfMedia(spotComment.getMedia().size())
                .mediaList(spotComment.getMedia().stream().sorted(Comparator.comparingLong(SpotCommentMedia::getIdInSpotMedia))
                        .limit(3).map(SpotCommentMediaMapper::toDto)
                        .sorted(Comparator.comparingLong(SpotCommentMediaDto::idInSpotMedia)).toList())
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

