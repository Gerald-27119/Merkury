package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.FavoriteSpot;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteSpotRepository extends JpaRepository<FavoriteSpot, Long> {
    Optional<List<FavoriteSpot>> findAllByUserUsername(String username);
    Optional<List<FavoriteSpot>> findAllByUserUsernameAndType(String username, FavoriteSpotsListType type);
    @Transactional
    @Modifying
    @Query("DELETE FROM favorite_spots fs WHERE fs.user.username = :username AND fs.type = :type AND fs.spot.id = :spotId")
    void removeFavoriteSpotByUserUsernameAndTypeAndSpotId(String username, FavoriteSpotsListType type, Long spotId);
}