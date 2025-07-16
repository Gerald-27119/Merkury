package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.Spot;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.Optional;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {
    @Query("SELECT s FROM spots s LEFT JOIN FETCH s.tags WHERE s.id = :id")
    Optional<Spot> findByIdWithTags(@Param("id") Long id);

    Page<Spot> findAllByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    @Query("SELECT s FROM spots s WHERE s.name LIKE %:name% AND s.rating >= :startRating AND s.centerPoint.x BETWEEN :swLat AND :neLat AND s.centerPoint.y BETWEEN :swLng AND :neLng")
    Page<Spot> findSpotsInCurrentViewByCriteria(@Param("swLat") double swLat,
                                                @Param("neLat") double neLat,
                                                @Param("swLng") double swLng,
                                                @Param("neLng") double neLng,
                                                @Param("name") String name,
                                                @Param("startRating") double startRating,
                                                Pageable pageable);
}
