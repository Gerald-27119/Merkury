package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SpotCommentRepository extends JpaRepository<SpotComment, Long> {

    Page<SpotComment> findBySpotIdOrderByPublishDateDescIdAsc(Long spotId, Pageable pageable);
    Optional<SpotComment> findCommentByIdAndAuthor(Long commentId, UserEntity author);
    List<SpotComment> findBySpotId(Long spotId);
}