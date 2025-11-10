package com.merkury.vulcanus.model.repositories.forum;

import com.merkury.vulcanus.model.entities.forum.PostCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostCategoryRepository extends JpaRepository<PostCategory, Long> {
    Optional<PostCategory> findByName(String name);
}
