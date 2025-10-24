package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SpotMediaRepository extends JpaRepository<SpotMedia, Long> {
    List<SpotMedia> findAllByAuthorUsernameAndGenericMediaTypeAndAddDateBetween(String username, GenericMediaType genericMediaType, LocalDate startDate, LocalDate endDate);

    List<SpotMedia> findByAuthorUsernameAndGenericMediaTypeAndAddDateGreaterThanEqual(String username, GenericMediaType genericMediaType, LocalDate startDate);

    List<SpotMedia> findByAuthorUsernameAndGenericMediaTypeAndAddDateLessThanEqual(String username, GenericMediaType genericMediaType, LocalDate endDate);

    List<SpotMedia> findAllByAuthorUsernameAndGenericMediaType(String username, GenericMediaType genericMediaType);

    List<SpotMedia> findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(UserEntity author, GenericMediaType genericMediaType);

    Page<SpotMedia> findBySpotIdAndGenericMediaType(Long spotId, GenericMediaType genericMediaType, Pageable pageable);

    @Query(
            value = """
                      WITH ranked AS (
                        SELECT
                          id,
                          ROW_NUMBER() OVER (
                            PARTITION BY spot_id, generic_media_type
                            ORDER BY
                              CASE WHEN :sorting = 'newest' THEN add_date END DESC,
                              CASE WHEN :sorting = 'newest' THEN id END ASC,
                              CASE WHEN :sorting = 'oldest' THEN add_date END ASC,
                              CASE WHEN :sorting = 'oldest' THEN id END ASC,
                              CASE WHEN :sorting = 'mostLiked' THEN likes END DESC,
                              CASE WHEN :sorting = 'mostLiked' THEN id END ASC,
                              id ASC
                          ) AS pos
                        FROM spot_media
                        WHERE spot_id = :spotId
                          AND generic_media_type = :mediaType
                      )
                      SELECT pos
                      FROM ranked
                      WHERE id = :mediaId
                    """,
            nativeQuery = true
    )
    Optional<Integer> findPositionForMedia(
            @Param("mediaId") Long mediaId,
            @Param("spotId") Long spotId,
            @Param("mediaType") String mediaType,
            @Param("sorting") String sorting
    );


    Optional<SpotMedia> findByIdAndSpotIdAndGenericMediaType(Long id, Long spotId, GenericMediaType genericMediaType);
}
