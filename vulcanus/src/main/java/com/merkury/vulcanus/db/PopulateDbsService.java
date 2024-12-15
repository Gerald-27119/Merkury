package com.merkury.vulcanus;

import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.PasswordResetTokenRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;
import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;

@Slf4j
@Service
@RequiredArgsConstructor
public class PopulateDbsService {

    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
    public void initPostgresDb() {
        UserEntity admin = UserEntity.builder()
                .email("admin@example.com")
                .username("admin")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_ADMIN)
                .provider(Provider.NONE)
                .build();

        UserEntity user = UserEntity.builder()
                .email("user@example.com")
                .username("user")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_USER)
                .provider(Provider.NONE)
                .build();

        for(int i = 0; i <10; i++){
            UserEntity locustUser = UserEntity.builder()
                    .email("user"+i+"@example.com")
                    .username("user"+i)
                    .password(passwordEncoder.encode("password"))
                    .userRole(ROLE_USER)
                    .provider(Provider.NONE)
                    .build();

            userEntityRepository.save(locustUser);
        }

        userEntityRepository.save(admin);
        userEntityRepository.save(user);

        log.info("Users from db:");
        userEntityRepository.findAll().forEach(userEntity ->
                log.info(userEntity.toString()));

        PasswordResetToken token = new PasswordResetToken(
                UUID.fromString("fff3a3f6-fbd8-4fc5-890c-626343f2f324"),
                LocalDateTime.now().plusMinutes(15),
                user.getEmail());

        passwordResetTokenRepository.save(token);
    }
}
