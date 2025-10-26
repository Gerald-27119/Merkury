package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    @EntityGraph(attributePaths = {"upVotedBy", "downVotedBy"})
    Page<PostComment> findAllByPost_IdAndParentIsNull(Long postId, Pageable pageable);

    Optional<PostComment> findByIdAndAuthor(Long commentId, UserEntity author);

    @Query(
            value = """
                    WITH RECURSIVE comment_tree AS (
                         SELECT * FROM post_comments WHERE parent_id = :parentId
                         UNION ALL
                         SELECT c.* FROM post_comments c
                         INNER JOIN comment_tree ct ON c.parent_id = ct.id
                    )
                    SELECT * FROM comment_tree 
                    WHERE (
                            CAST(:lastDate AS timestamp) IS NULL
                            OR (publish_date > CAST(:lastDate AS timestamp))
                            OR (publish_date = CAST(:lastDate AS timestamp) AND id >= CAST(:lastId AS bigint))
                    )
                    ORDER BY publish_date ASC, id ASC
                    LIMIT :pageSize
                    """,
            nativeQuery = true
    )
    List<PostComment> findRepliesRecursiveKeyset(
            @Param("parentId") Long parentId,
            @Param("lastDate") LocalDateTime lastDate,
            @Param("lastId") Long lastId,
            @Param("pageSize") int pageSize
    );
}
