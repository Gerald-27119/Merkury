package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopulateFriendsService {

    private final UserEntityRepository userEntityRepository;
    private final Random random = new Random();

    @Transactional
    public void initFriendsData() {
        List<String> usernames = List.of(
                "annaKowalska",
                "michalNowak",
                "kasiaWisniewska",
                "piotrZielinski",
                "olaLewandowska",
                "tomekWojcik",
                "nataliaKaminska",
                "bartekSzymanski",
                "magdaKozlowska",
                "krzysiekJankowski",
                "julkaMazur",
                "pawelKrawczyk"
        );

        List<UserEntity> users = usernames.stream()
                .map(u -> userEntityRepository.findByUsername(u)
                        .orElseThrow(() -> new IllegalStateException("Brak użytkownika w DB: " + u)))
                .collect(Collectors.toCollection(ArrayList::new));

        for (UserEntity user : users) {
            int followCount = random.nextInt(20); // 0..19
            Set<UserEntity> followers = getRandomSubset(users, followCount, user);
            user.getFollowers().addAll(followers);
        }

        Set<String> createdPairs = new HashSet<>();

        for (UserEntity user : users) {
            int numberOfFriends = random.nextInt(20); // 0..19

            for (int i = 0; i < numberOfFriends; i++) {
                UserEntity potentialFriend = users.get(random.nextInt(users.size()));
                if (user.equals(potentialFriend)) continue;

                String key = user.getId() + "-" + potentialFriend.getId();
                String reverseKey = potentialFriend.getId() + "-" + user.getId();
                if (createdPairs.contains(key) || createdPairs.contains(reverseKey)) continue;

                LocalDateTime now = LocalDateTime.now();

                Friendship friendship = Friendship.builder()
                        .user(user)
                        .friend(potentialFriend)
                        .status(UserFriendStatus.ACCEPTED)
                        .createdAt(now)
                        .build();

                Friendship reverse = Friendship.builder()
                        .user(potentialFriend)
                        .friend(user)
                        .status(UserFriendStatus.ACCEPTED)
                        .createdAt(now)
                        .build();

                user.getFriendships().add(friendship);
                potentialFriend.getFriendships().add(reverse);

                createdPairs.add(key);
                createdPairs.add(reverseKey);
            }
        }

        UserEntity michal = find(users, "michalNowak");
        michal.getFollowers().add(find(users, "olaLewandowska"));
        michal.getFollowers().add(find(users, "kasiaWisniewska"));
        michal.getFollowers().add(find(users, "piotrZielinski"));

        userEntityRepository.saveAll(users);
    }

    private UserEntity find(List<UserEntity> users, String username) {
        return users.stream()
                .filter(u -> username.equals(u.getUsername()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Brak na liście seedowanej: " + username));
    }

    private Set<UserEntity> getRandomSubset(List<UserEntity> allUsers, int count, UserEntity exclude) {
        List<UserEntity> list = allUsers.stream()
                .filter(u -> !u.equals(exclude))
                .collect(Collectors.toList());

        Collections.shuffle(list, random);
        return new HashSet<>(list.subList(0, Math.min(count, list.size())));
    }
}
