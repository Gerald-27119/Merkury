package com.merkury.vulcanus;

import com.merkury.vulcanus.account.passwordResetToken.PasswordResetToken;
import com.merkury.vulcanus.account.passwordResetToken.PasswordResetTokenRepository;
import com.merkury.vulcanus.account.user.Role;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import com.merkury.vulcanus.message.Message;
import com.merkury.vulcanus.message.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class PopulateDbs {

    private final MessageRepository messageRepository;
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Bean
    CommandLineRunner initPostgresDb() {
        return args -> {

            PasswordResetToken token = new PasswordResetToken(UUID.fromString("fff3a3f6-fbd8-4fc5-890c-626343f2f324"), LocalDateTime.now().plusMinutes(15), null);

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
                    .passwordResetToken(token)
                    .build();

            passwordResetTokenRepository.save(token);
            userEntityRepository.save(admin);
            userEntityRepository.save(user);
            token.setUser(user);
            passwordResetTokenRepository.save(token);


            log.info("Users from db:");
            userEntityRepository.findAll().forEach(userEntity ->
                    log.info(userEntity.toString()));
        };
    }

    @Bean
    CommandLineRunner initMongoDb(MongoTemplate mongoTemplate) {
        // Drop the collection before initializing it (in .properties it doesn't work, idk why)
        mongoTemplate.getDb().getCollection("messages").drop();

        return args -> {
            List<Message> messages = List.of(
                    Message.builder().message("Hello, this is the first message!").build(),
                    Message.builder().message("Second message with more content.").build(),
                    Message.builder().message("Another interesting message here.").build(),
                    Message.builder().message("Learning Spring Boot with MongoDB.").build(),
                    Message.builder().message("Final message for initialization.").build()
            );

            messageRepository.saveAll(messages);

            log.info("Messages from db:");
            messageRepository.findAll().forEach(message ->
                    log.info(message.toString()));
        };
    }
}
