package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Optional<Post> findPostByIdAndAuthor(Long postId, UserEntity author);

    @Modifying
    @Query("update posts p set p.views = p.views + 1 where p.id = :id")
    int incrementViews(@Param("id") Long postId);

    @Modifying
    @Query("update posts p set p.commentsCount = p.commentsCount + 1 where p.id = :id")
    int incrementCommentsCount(@Param("id") Long postId);

    List<Post> findTop10ByTitleContainingIgnoreCase(String phrase);

    @Query("""
            SELECT p 
            FROM posts p
            WHERE p.publishDate >= :monthAgo
            ORDER BY (p.views + p.upVotes * 2 - p.downVotes) DESC
            """)
    List<Post> findTopTrendingPosts(@Param("monthAgo") LocalDateTime monthAgo, Pageable pageable);
}
