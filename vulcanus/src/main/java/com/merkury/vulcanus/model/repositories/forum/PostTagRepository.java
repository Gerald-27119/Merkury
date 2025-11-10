package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.forum.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostTagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
}
