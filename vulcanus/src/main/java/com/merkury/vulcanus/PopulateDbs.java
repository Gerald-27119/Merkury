//package com.merkury.vulcanus;
//
//import com.merkury.vulcanus.model.enums.Provider;
//import com.merkury.vulcanus.model.entities.PasswordResetToken;
//import com.merkury.vulcanus.model.repositories.PasswordResetTokenRepository;
//import com.merkury.vulcanus.model.enums.Role;
//import com.merkury.vulcanus.model.entities.UserEntity;
//import com.merkury.vulcanus.model.repositories.UserEntityRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//
//@Slf4j
//@Configuration
//@RequiredArgsConstructor
//public class PopulateDbs {
//
//    private final UserEntityRepository userEntityRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final PasswordResetTokenRepository passwordResetTokenRepository;
//
//    @Bean
//    CommandLineRunner initPostgresDb() {
//        return args -> {
//            UserEntity admin = UserEntity.builder()
//                    .email("admin@example.com")
//                    .username("admin")
//                    .password(passwordEncoder.encode("password"))
//                    .role(Role.ADMIN)
//                    .provider(Provider.NONE)
//                    .build();
//
//            UserEntity user = UserEntity.builder()
//                    .email("user@example.com")
//                    .username("user")
//                    .password(passwordEncoder.encode("password"))
//                    .role(Role.USER)
//                    .provider(Provider.NONE)
//                    .build();
//
//            userEntityRepository.save(admin);
//            userEntityRepository.save(user);
//
//            log.info("Users from db:");
//            userEntityRepository.findAll().forEach(userEntity ->
//                    log.info(userEntity.toString()));
//
//            PasswordResetToken token = new PasswordResetToken(
//                    UUID.fromString("fff3a3f6-fbd8-4fc5-890c-626343f2f324"),
//                    LocalDateTime.now().plusMinutes(15),
//                    user.getEmail());
//
//            passwordResetTokenRepository.save(token);
//        };
//    }
//
//    @Bean
//    void initMongoDb(MongoTemplate mongoTemplate) {
//        // Drop the collection before initializing it (in .properties it doesn't work, idk why)
//        mongoTemplate.getDb().getCollection("password_reset_token").drop();
//
//
//    }
//}
