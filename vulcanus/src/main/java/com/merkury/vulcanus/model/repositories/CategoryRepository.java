package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.forum.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
