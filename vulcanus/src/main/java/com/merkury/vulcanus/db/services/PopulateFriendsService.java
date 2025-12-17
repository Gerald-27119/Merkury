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
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopulateFriendsService {

    private final UserEntityRepository userEntityRepository;

    private static final LocalDateTime SEED_TIME = LocalDateTime.of(2025, 1, 1, 12, 0);

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

        Map<String, UserEntity> u = usernames.stream()
                .collect(Collectors.toMap(
                        Function.identity(),
                        username -> userEntityRepository.findByUsername(username)
                                .orElseThrow(() -> new IllegalStateException("Brak użytkownika w DB: " + username)),
                        (a, b) -> a,
                        LinkedHashMap::new
                ));

        u.values().forEach(user -> {
            user.getFollowers().clear();
            user.getFriendships().clear();
        });

        addFollowers(u, "michalNowak", "olaLewandowska", "kasiaWisniewska", "piotrZielinski");
        addFollowers(u, "annaKowalska", "michalNowak", "julkaMazur", "pawelKrawczyk");
        addFollowers(u, "kasiaWisniewska", "annaKowalska", "olaLewandowska");
        addFollowers(u, "piotrZielinski", "michalNowak", "bartekSzymanski");
        addFollowers(u, "olaLewandowska", "magdaKozlowska", "annaKowalska");
        addFollowers(u, "tomekWojcik", "piotrZielinski", "krzysiekJankowski");
        addFollowers(u, "nataliaKaminska", "julkaMazur");
        addFollowers(u, "bartekSzymanski", "pawelKrawczyk");
        addFollowers(u, "magdaKozlowska", "olaLewandowska", "kasiaWisniewska");
        addFollowers(u, "krzysiekJankowski", "tomekWojcik");
        addFollowers(u, "julkaMazur", "nataliaKaminska", "annaKowalska");
        addFollowers(u, "pawelKrawczyk", "tomekWojcik", "michalNowak");

        AtomicInteger idx = new AtomicInteger(0);

        addFriendship(u, "annaKowalska", "michalNowak", idx);
        addFriendship(u, "annaKowalska", "kasiaWisniewska", idx);
        addFriendship(u, "annaKowalska", "piotrZielinski", idx);

        addFriendship(u, "michalNowak", "olaLewandowska", idx);
        addFriendship(u, "michalNowak", "tomekWojcik", idx);

        addFriendship(u, "kasiaWisniewska", "julkaMazur", idx);
        addFriendship(u, "piotrZielinski", "bartekSzymanski", idx);

        addFriendship(u, "olaLewandowska", "magdaKozlowska", idx);
        addFriendship(u, "tomekWojcik", "pawelKrawczyk", idx);

        addFriendship(u, "nataliaKaminska", "krzysiekJankowski", idx);
        addFriendship(u, "bartekSzymanski", "pawelKrawczyk", idx);
        addFriendship(u, "magdaKozlowska", "julkaMazur", idx);

        userEntityRepository.saveAll(u.values());
    }

    private void addFollowers(Map<String, UserEntity> u, String user, String... followers) {
        UserEntity target = get(u, user);
        for (String followerUsername : followers) {
            target.getFollowers().add(get(u, followerUsername));
        }
    }

    private void addFriendship(Map<String, UserEntity> u, String a, String b, AtomicInteger idx) {
        UserEntity userA = get(u, a);
        UserEntity userB = get(u, b);

        LocalDateTime createdAt = SEED_TIME.plusMinutes(idx.getAndIncrement());

        Friendship ab = Friendship.builder()
                .user(userA)
                .friend(userB)
                .status(UserFriendStatus.ACCEPTED)
                .createdAt(createdAt)
                .build();

        Friendship ba = Friendship.builder()
                .user(userB)
                .friend(userA)
                .status(UserFriendStatus.ACCEPTED)
                .createdAt(createdAt)
                .build();

        userA.getFriendships().add(ab);
        userB.getFriendships().add(ba);
    }

    private UserEntity get(Map<String, UserEntity> u, String username) {
        UserEntity user = u.get(username);
        if (user == null) throw new IllegalStateException("Brak na liście seedowanej: " + username);
        return user;
    }
}
