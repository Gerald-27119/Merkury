package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.comments.CommentDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CommentsMapper {
    private CommentsMapper(){
    }

    public static DatedCommentsGroupDto toDto(@NotNull List<CommentDto> comments, @NotNull LocalDate date){
        return DatedCommentsGroupDto.builder()
                .addDate(date)
                .spotName(comments.getFirst().spotName())
                .comments(comments)
                .build();
    }

    public static CommentDto toDto(@NotNull SpotComment spotComment){
        return CommentDto.builder()
                .addTime(LocalTime.of(spotComment.getAddDate().getHour(), spotComment.getAddDate().getMinute()))
                .text(spotComment.getText())
                .id(spotComment.getId())
                .spotName(spotComment.getSpot().getName())
                .build();
    }
}
