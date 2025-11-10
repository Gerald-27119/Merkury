package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.entities.forum.PostCommentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostCommentReportRepository extends JpaRepository<PostCommentReport, Long> {
    boolean existsByUserAndComment(UserEntity user, PostComment comment);
}
