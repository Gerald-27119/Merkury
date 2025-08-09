package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByUsernameAndIdNot(String username, Long id);

    Optional<UserEntity> findByUsernameOrEmail(String username, String email);

    List<UserEntity> findAllByEmail(String email);

    List<UserEntity> findAllByUsername(String username);

    Page<UserEntity> findFollowersByFollowedUsername(String username, Pageable pageable);

    Page<UserEntity> findFollowedByFollowersUsername(String username, Pageable pageable);
}
