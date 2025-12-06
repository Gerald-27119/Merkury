package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.interfaces.FriendView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Slice<FriendView> findAllByUserUsernameAndStatus(String username, Pageable pageable, UserFriendStatus status);

    Optional<Friendship> findByUserAndFriend(UserEntity user, UserEntity friend);
}
