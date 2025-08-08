package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SpotMediaRepository extends JpaRepository<SpotMedia, Long> {
    Page<SpotMedia> findAllByAuthorUsernameAndGenericMediaTypeAndAddDateBetween(String username, GenericMediaType genericMediaType, LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<SpotMedia> findByAuthorUsernameAndGenericMediaTypeAndAddDateGreaterThanEqual(String username, GenericMediaType genericMediaType, LocalDate startDate, Pageable pageable);

    Page<SpotMedia> findByAuthorUsernameAndGenericMediaTypeAndAddDateLessThanEqual(String username, GenericMediaType genericMediaType, LocalDate endDate, Pageable pageable);

    Page<SpotMedia> findAllByAuthorUsernameAndGenericMediaType(String username, GenericMediaType genericMediaType, Pageable pageable);

    List<SpotMedia> findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(UserEntity author, GenericMediaType genericMediaType);
}
