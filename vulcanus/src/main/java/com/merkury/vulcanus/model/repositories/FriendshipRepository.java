package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.interfaces.FriendView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Slice<FriendView> findAllByUserUsername(String username, Pageable pageable);
}
