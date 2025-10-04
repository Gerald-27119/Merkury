package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    Page<PostComment> findAllByPost_Id(Long postId, Pageable pageable);
    Optional<PostComment> findByIdAndAuthor(Long commentId, UserEntity author);
}
