package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostReportRepository extends JpaRepository<PostReport, Long> {
    boolean existsByUserAndPost(UserEntity user, Post post);
}
