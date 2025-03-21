package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(UUID token);
    void deleteByUserEmail(String email);
}
