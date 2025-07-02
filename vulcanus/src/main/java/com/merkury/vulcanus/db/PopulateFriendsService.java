package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;

@Service
@RequiredArgsConstructor
public class PopulateFriendsService {
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    Random random = new Random();

    @Transactional
    public void initPostgresDb() {
        List<UserEntity> users = new ArrayList<>();

        for (int i = 31; i < 80; i++) {
            var user = UserEntity.builder()
                    .email("user" + i + "@example.com")
                    .username("user" + i)
                    .password(passwordEncoder.encode("password"))
                    .userRole(ROLE_USER)
                    .provider(Provider.NONE)
                    .followed(new HashSet<>())
                    .build();

            users.add(user);
        }

        users.add(userEntityRepository.findByUsername("user").get());

        userEntityRepository.saveAll(users);

        for (var user : users) {
            int followCount = random.nextInt(20);

            var follows = getRandomSubset(users, followCount, user);
            user.getFollowers().addAll(follows);
            userEntityRepository.save(user);
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

                        userEntityRepository.save(user);
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
