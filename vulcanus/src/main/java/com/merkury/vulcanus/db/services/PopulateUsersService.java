package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;

@Service
@RequiredArgsConstructor
public class PopulateUsersService {

    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initUserData() {

        var userList = new ArrayList<UserEntity>();

        var admin = UserEntity.builder()
                .username("admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_ADMIN)
                .build();

        userList.add(admin);

        var user = UserEntity.builder()
                .username("user")
                .email("user@example.com")
                .password(passwordEncoder.encode("password"))
                .profilePhoto("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
                .build();

        userList.add(user);

        for (int i = 0; i < 101; i++) {
            var userX = UserEntity.builder()
                    .username("user" + i)
                    .email("user" + i + "@example.com")
                    .password(passwordEncoder.encode("password"))
                    .build();

            userList.add(userX);
        }

        userEntityRepository.saveAll(userList);
    }
}
