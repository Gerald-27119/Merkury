package com.merkury.vulcanus.account.password.reset.token;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(UUID token);
    void deleteByExpirationDateBefore(LocalDateTime now);

}
