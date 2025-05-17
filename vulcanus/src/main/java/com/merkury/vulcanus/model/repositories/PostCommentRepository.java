package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.forum.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
}
