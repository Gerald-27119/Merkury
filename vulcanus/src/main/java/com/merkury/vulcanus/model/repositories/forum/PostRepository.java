package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findPostByIdAndAuthor(Long postId, UserEntity author);

    @Modifying
    @Query("update posts p set p.views = p.views + 1 where p.id = :id")
    int incrementViews(@Param("id") Long postId);

    @Modifying
    @Query("update posts p set p.commentsCount = p.commentsCount + 1 where p.id = :id")
    int incrementCommentsCount(@Param("id") Long postId);

}
