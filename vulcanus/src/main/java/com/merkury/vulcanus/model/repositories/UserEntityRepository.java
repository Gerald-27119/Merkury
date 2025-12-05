package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUsernameOrEmail(String username, String email);

    List<UserEntity> findAllByEmail(String email);

    List<UserEntity> findAllByUsername(String username);

    Slice<UserEntity> findFollowersByFollowedUsername(String username, Pageable pageable);

    Slice<UserEntity> findFollowedByFollowersUsername(String username, Pageable pageable);

    Slice<UserEntity> findAllByUsernameContainingIgnoreCaseAndUsernameNot(String usernamePart, String username, Pageable pageable);

    List<UserEntity> findAllByUsernameIn(List<String> usernames);

    Slice<UserEntity> findAllByUsernameContainingIgnoreCaseAndUsernameNotIn(String usernamePart, Pageable pageable, List<String> usernames);

    List<UserEntity> findTop10ByUsernameContainingIgnoreCase(String usernamePart);

}
