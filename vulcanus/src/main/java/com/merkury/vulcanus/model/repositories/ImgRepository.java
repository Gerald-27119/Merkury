package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImgRepository extends JpaRepository<Img, Long> {
    List<Img> findTop4ByAuthorOrderByLikesDesc(UserEntity author);
}
