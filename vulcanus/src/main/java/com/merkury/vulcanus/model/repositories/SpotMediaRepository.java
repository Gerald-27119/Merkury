package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SpotMediaRepository extends JpaRepository<SpotMedia, Long> {
    List<SpotMedia> findAllByAuthorUsernameAndGenericMediaTypeAndAddDateBetween(String username, GenericMediaType genericMediaType, LocalDate startDate, LocalDate endDate);
    List<SpotMedia> findAllByAuthorUsernameAndGenericMediaType(String username, GenericMediaType genericMediaType);
    List<SpotMedia> findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(UserEntity author, GenericMediaType genericMediaType);
}
