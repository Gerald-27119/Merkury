package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.FavoriteSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteSpotRepository extends JpaRepository<FavoriteSpot, Long> {
    Optional<List<FavoriteSpot>> findAllByUserUsername(String username);
}
