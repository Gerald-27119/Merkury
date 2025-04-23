package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class PopulateUsersService {

    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;

    @Transactional
    public void initUsers() {
        var users = generateUsers();
        userEntityRepository.saveAll(users);
    }

    private List<UserEntity> generateUsers() {
        return IntStream.rangeClosed(1, 30)
                .mapToObj(i -> UserEntity.builder()
                        .email(String.format("user%d@example.com", i))
                        .username("user" + i)
                        .password(passwordEncoder.encode("password"))
                        .build()
                )
                .collect(Collectors.toList());
    }
}
