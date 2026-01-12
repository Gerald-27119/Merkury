package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.forum.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
    List<PostMedia> findByPostId(Long postId);

    void deleteAllByUrlIn(List<String> urls);
}
