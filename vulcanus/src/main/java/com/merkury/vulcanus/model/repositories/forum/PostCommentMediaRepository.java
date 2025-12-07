package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.forum.PostCommentMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentMediaRepository extends JpaRepository<PostCommentMedia, Long> {
    List<PostCommentMedia> findByPostCommentId(Long commentId);

    void deleteByUrl(String url);

    void deleteByPostCommentId(Long commentId);
}
