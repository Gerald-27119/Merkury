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

    @Query("""
        SELECT COUNT(sm)
        FROM spot_media sm
        JOIN spot_media target ON target.id = :mediaId
        WHERE sm.spot.id = :spotId
          AND sm.genericMediaType = :mediaType
          AND target.spot.id = :spotId
          AND target.genericMediaType = :mediaType
          AND (
            (:sorting = 'newest' AND
                (sm.addDate > target.addDate
                 OR (sm.addDate = target.addDate AND sm.id > target.id))
            )
            OR (:sorting = 'oldest' AND
                (sm.addDate < target.addDate
                 OR (sm.addDate = target.addDate AND sm.id < target.id))
            )
            OR (:sorting = 'mostLiked' AND
                (sm.likes > target.likes
                 OR (sm.likes = target.likes AND sm.id > target.id))
            )
            OR (:sorting IS NULL AND
                (sm.addDate > target.addDate
                 OR (sm.addDate = target.addDate AND sm.id > target.id))
            )
          )
    """)
    Long countBeforeWithTieBreaker(
            @Param("mediaId") Long mediaId,
            @Param("spotId") Long spotId,
            @Param("mediaType") GenericMediaType mediaType,
            @Param("sorting") String sorting
    );

    Optional<SpotMedia> findByIdAndSpotIdAndGenericMediaType(Long id, Long spotId, GenericMediaType genericMediaType);
}
