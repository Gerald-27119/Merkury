package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findAllCommentsBySpotIdOrderByPublishDateDesc(Long spotId);
}