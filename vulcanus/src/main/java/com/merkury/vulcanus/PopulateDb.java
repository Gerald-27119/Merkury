package com.merkury.vulcanus;

import com.merkury.vulcanus.account.user.Role;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class PopulateDb {

    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            UserEntity admin = UserEntity.builder()
                    .email("admin@example.com")
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .build();

            UserEntity user = UserEntity.builder()
                    .email("user@example.com")
                    .username("user")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.USER)
                    .build();

            userEntityRepository.save(admin);
            userEntityRepository.save(user);
        };
    }
}
