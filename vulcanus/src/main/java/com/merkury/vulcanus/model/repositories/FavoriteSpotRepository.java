package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface FavoriteSpotRepository extends JpaRepository<FavoriteSpot, Long> {
    Slice<FavoriteSpot> findAllByUserUsername(String username, Pageable pageable);

    Slice<FavoriteSpot> findAllByUserUsernameAndType(String username, FavoriteSpotsListType type, Pageable pageable);

    @Transactional
    @Modifying
    @Query("DELETE FROM favorite_spots fs WHERE fs.user.username = :username AND fs.type = :type AND fs.spot.id = :spotId")
    Integer removeFavoriteSpotByUserUsernameAndTypeAndSpotId(String username, FavoriteSpotsListType type, Long spotId);

    boolean existsByUserUsernameAndSpotIdAndType(String userUsername, Long spotId, FavoriteSpotsListType type);

    boolean existsByUserUsernameAndSpotIdAndTypeNot(String userUsername, Long spotId, FavoriteSpotsListType type);

    Optional<FavoriteSpot> findByUserUsernameAndSpotId(String userUsername, Long spotId);
}