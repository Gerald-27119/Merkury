package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.ContentAlreadyReportedException;
import com.merkury.vulcanus.exception.exceptions.OwnContentReportException;
import com.merkury.vulcanus.model.dtos.forum.ForumReportDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.entities.forum.PostCommentReport;
import com.merkury.vulcanus.model.entities.forum.PostReport;
import com.merkury.vulcanus.model.repositories.forum.PostCommentReportRepository;
import com.merkury.vulcanus.model.repositories.forum.PostReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PostReportRepository postReportRepository;
    private final PostCommentReportRepository postCommentReportRepository;

    public void reportPost(ForumReportDto dto, Post post, UserEntity user) throws ContentAlreadyReportedException, OwnContentReportException {

        if (post.getAuthor().equals(user)) {
            throw new OwnContentReportException("post");
        }

        if (postReportRepository.existsByUserAndPost(user, post)) {
            throw new ContentAlreadyReportedException("Post");
        }

        var report = PostReport.builder()
                .reason(dto.reason())
                .details(dto.details())
                .user(user)
                .post(post)
                .build();

        postReportRepository.save(report);
    }

    public void reportPostComment(ForumReportDto dto, PostComment comment, UserEntity user) throws ContentAlreadyReportedException, OwnContentReportException {

        if(comment.getAuthor().equals(user)) {
            throw new OwnContentReportException("comment");
        }

        if (postCommentReportRepository.existsByUserAndComment(user, comment)) {
            throw new ContentAlreadyReportedException("Comment");
        }

        var report = PostCommentReport.builder()
                .reason(dto.reason())
                .details(dto.details())
                .user(user)
                .comment(comment)
                .build();

        postCommentReportRepository.save(report);
    }

}
