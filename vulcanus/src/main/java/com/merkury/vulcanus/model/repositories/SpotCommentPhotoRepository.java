package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotCommentPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpotCommentPhotoRepository extends JpaRepository<SpotCommentPhoto, Long> {
    @Query("SELECT p FROM spot_comment_photo p WHERE p.spotComment.id = :commentId AND p.spotComment.spot.id = :spotId")
    List<SpotCommentPhoto> findBySpotIdAndCommentId(@Param("spotId") Long spotId, @Param("commentId") Long commentId);
}
