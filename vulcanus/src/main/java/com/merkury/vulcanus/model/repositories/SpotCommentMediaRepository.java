package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotCommentMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpotCommentMediaRepository extends JpaRepository<SpotCommentMedia, Long> {
    List<SpotCommentMedia> findBySpotCommentIdAndSpotCommentSpotId(@Param("spotId") Long spotId, @Param("commentId") Long commentId);
}
