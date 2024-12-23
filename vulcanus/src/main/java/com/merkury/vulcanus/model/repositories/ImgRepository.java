package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Img;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImgRepository extends JpaRepository<Img, Long> {
}
