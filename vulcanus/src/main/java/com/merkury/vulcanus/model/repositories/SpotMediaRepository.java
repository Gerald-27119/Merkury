package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpotMediaRepository extends JpaRepository<SpotMedia, Long> {
    List<SpotMedia> findAllByAuthorUsername(String username);
    List<SpotMedia> findTop4ByAuthorAndMediaTypeOrderByLikesDesc(UserEntity author, MediaType mediaType);
}
