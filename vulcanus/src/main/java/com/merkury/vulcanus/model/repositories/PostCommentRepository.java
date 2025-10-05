package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    @EntityGraph(attributePaths = {"author", "upVotedBy", "downVotedBy"})
    Page<PostComment> findAllByPost_IdAndParentIsNull(Long postId, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "upVotedBy", "downVotedBy"})
    Page<PostComment> findAllByParent_Id(Long parentId, Pageable pageable);

    Optional<PostComment> findByIdAndAuthor(Long commentId, UserEntity author);
}
