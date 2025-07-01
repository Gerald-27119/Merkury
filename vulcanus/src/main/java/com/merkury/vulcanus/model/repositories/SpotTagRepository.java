package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.SpotTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotTagRepository extends JpaRepository<SpotTag, Long> {
}
