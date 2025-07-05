package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopulateFriendsService {

    private final UserEntityRepository userEntityRepository;
    private final Random random = new Random();

    @Transactional
    public void initFriendsData() {
        var users = userEntityRepository.findAll().subList(31,80);

        users.add(userEntityRepository.findByUsername("user").orElseThrow());

        for (var user : users) {
            int followCount = random.nextInt(20);

            var follows = getRandomSubset(users, followCount, user);
            user.getFollowers().addAll(follows);
        }

        var createdPairs = new HashSet<>();

        for (var user : users) {
            int numberOfFriends = random.nextInt(20);

            for (int i = 0; i < numberOfFriends; i++) {
                var potentialFriend = users.get(random.nextInt(users.size()));

                if (!user.equals(potentialFriend)) {
                    var key = user.getId() + "-" + potentialFriend.getId();
                    var reverseKey = potentialFriend.getId() + "-" + user.getId();

                    if (!createdPairs.contains(key) && !createdPairs.contains(reverseKey)) {
                        var friendship = Friendship.builder()
                                .user(user)
                                .friend(potentialFriend)
                                .status(UserFriendStatus.ACCEPTED)
                                .createdAt(LocalDateTime.now())
                                .build();

                        var reverse = Friendship.builder()
                                .user(potentialFriend)
                                .friend(user)
                                .status(UserFriendStatus.ACCEPTED)
                                .createdAt(LocalDateTime.now())
                                .build();

                        user.getFriendships().add(friendship);
                        potentialFriend.getFriendships().add(reverse);

                        createdPairs.add(key);
                        createdPairs.add(reverseKey);
                    }
                }
            }
        }

        users.get(1).getFollowers().add(users.get(4));
        users.get(1).getFollowers().add(users.get(2));
        users.get(1).getFollowers().add(users.get(3));
        userEntityRepository.saveAll(users);
    }

    private Set<UserEntity> getRandomSubset(List<UserEntity> allUsers, int count, UserEntity exclude) {
        return allUsers.stream()
                .filter(u -> !u.equals(exclude))
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        list -> {
                            Collections.shuffle(list);
                            return new HashSet<>(list.subList(0, Math.min(count, list.size())));
                        }
                ));
    }

}
