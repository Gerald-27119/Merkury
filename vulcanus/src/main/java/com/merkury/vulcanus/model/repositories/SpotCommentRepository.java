package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface SpotCommentRepository extends JpaRepository<SpotComment, Long> {

    @EntityGraph(attributePaths = {"media", "upVotedBy", "downVotedBy"})
    Page<SpotComment> findBySpotIdOrderByPublishDateDescIdAsc(Long spotId, Pageable pageable);

    Optional<SpotComment> findCommentByIdAndAuthor(Long commentId, UserEntity author);

    List<SpotComment> findBySpotId(Long spotId);

    Slice<SpotComment> findAllByAuthorUsername(String username, Pageable pageable);

    Slice<SpotComment> findAllByAuthorUsernameAndPublishDateBetween(String username, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Slice<SpotComment> findAllByAuthorUsernameAndPublishDateGreaterThanEqual(String username, LocalDateTime startDate, Pageable pageable);

    Slice<SpotComment> findAllByAuthorUsernameAndPublishDateLessThanEqual(String username, LocalDateTime endDate, Pageable pageable);
}