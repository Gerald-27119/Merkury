package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.comments.CommentDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class CommentsMapper {
    private CommentsMapper(){
    }

    public static DatedCommentsGroupDto toDto(@NotNull List<CommentDto> comments, @NotNull LocalDate date, @NotNull String spotName){
        return DatedCommentsGroupDto.builder()
                .date(date)
                .spotName(spotName)
                .comments(comments)
                .build();
    }

    public static CommentDto toDto(@NotNull SpotComment spotComment){
        return CommentDto.builder()
                .addTime(spotComment.getPublishDate().toLocalTime())
                .text(spotComment.getText())
                .id(spotComment.getId())
                .spotName(spotComment.getSpot().getName())
                .build();
    }
}
