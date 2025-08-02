package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.interfaces.ISpotNameOnly;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {
    @Query("SELECT s FROM spots s LEFT JOIN FETCH s.tags WHERE s.id = :id")
    Optional<Spot> findByIdWithTags(@Param("id") Long id);

    Page<Spot> findAllByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    @Query("SELECT s FROM spots s ORDER BY s.rating DESC, s.viewsCount DESC")
    List<Spot> findTop18ByOrderByRatingAndViewsCount(Pageable pageable);

    List<Spot> findAllByCountryAndRegionAndCity(String country, String region, String city);

    Page<Spot> findByNameContainingIgnoreCaseAndRatingGreaterThanEqualAndCenterPointXBetweenAndCenterPointYBetween(
            String name,
            double startRating,
            double swLat,
            double neLat,
            double swLng,
            double neLng,
            Pageable pageable
    );

    List<ISpotNameOnly> findByNameContainingIgnoreCaseAndCenterPointXBetweenAndCenterPointYBetween(
            String name, double swLat, double neLat, double swLng, double neLng
    );

    @Query("SELECT DISTINCT s.country FROM spots s WHERE LOWER(s.country) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findDistinctCountriesStartingWith(@Param("query") String query);

    @Query("SELECT DISTINCT s.region FROM spots s WHERE LOWER(s.region) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findDistinctRegionsStartingWith(@Param("query") String query);

    @Query("SELECT DISTINCT s.city FROM spots s WHERE LOWER(s.city) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findDistinctCitiesStartingWith(@Param("query") String query);

    @Query("SELECT s FROM spots s JOIN s.tags t WHERE s.city = :city  AND LOWER(t.name) IN :tagNames GROUP BY s HAVING COUNT(DISTINCT LOWER(t.name)) = :tagCount")
    List<Spot> findSpotsByCityAndAllTagNames(
            @Param("city") String city,
            @Param("tagNames") List<String> tagNames,
            @Param("tagCount") long tagCount
    );
}
