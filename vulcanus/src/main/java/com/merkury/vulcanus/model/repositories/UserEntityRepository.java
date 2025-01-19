package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByUsernameAndIdNot(String username, Long id);
    @Query("SELECT s FROM users u JOIN u.favoriteSpots s WHERE u.id = :userId")
    Page<Spot> findPagedFavouriteSpotsByUserId(Long userId, Pageable pageable);
}
