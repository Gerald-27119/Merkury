package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotCommentMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpotCommentMediaRepository extends JpaRepository<SpotCommentMedia, Long> {
    @Query("SELECT p FROM spot_comment_media p WHERE p.spotComment.id = :commentId AND p.spotComment.spot.id = :spotId")
    List<SpotCommentMedia> findBySpotIdAndCommentId(@Param("spotId") Long spotId, @Param("commentId") Long commentId);
}
