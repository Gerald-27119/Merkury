package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllCommentsBySpotIdOrderByPublishDateDesc(Long spotId, Pageable pageable);
}