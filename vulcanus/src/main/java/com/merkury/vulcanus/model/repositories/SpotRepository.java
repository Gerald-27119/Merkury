package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {
}
