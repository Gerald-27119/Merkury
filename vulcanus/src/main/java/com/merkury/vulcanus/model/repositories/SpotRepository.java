package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.interfaces.CityView;
import com.merkury.vulcanus.model.interfaces.CountryView;
import com.merkury.vulcanus.model.interfaces.ISpotNameOnly;
import com.merkury.vulcanus.model.interfaces.RegionView;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long>, JpaSpecificationExecutor<Spot> {
    @Query("SELECT s FROM spots s LEFT JOIN FETCH s.tags WHERE s.id = :id")
    Optional<Spot> findByIdWithTags(@Param("id") Long id);

    Page<Spot> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Spot> findAllByNameContainingIgnoreCase(String name);

    List<Spot> findTop18ByOrderByRatingDescViewsCountDesc();


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


    List<RegionView> findDistinctByRegionStartingWithIgnoreCase(String query);

    List<CountryView> findDistinctByCountryStartingWithIgnoreCase(String query);

    List<CityView> findDistinctByCityStartingWithIgnoreCase(String query);

    List<ISpotNameOnly> findByNameContainingIgnoreCase(String name);
}
