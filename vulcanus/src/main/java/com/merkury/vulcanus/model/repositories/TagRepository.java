package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.forum.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

}
