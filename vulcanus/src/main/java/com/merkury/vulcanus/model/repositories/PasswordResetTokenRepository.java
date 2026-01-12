package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(UUID token);

    Optional<PasswordResetToken> findByUserEmail(String email);

    void deleteByExpirationDateBefore(LocalDateTime date);

    //Conflict - race condition
    @Modifying
    @Query(value = """
                INSERT INTO password_reset_token (token, expiration_date, user_email)
                VALUES (:token, :expiration, :email)
                ON CONFLICT (user_email)
                DO UPDATE SET
                    token = EXCLUDED.token,
                    expiration_date = EXCLUDED.expiration_date
            """, nativeQuery = true)
    int upsertToken(@Param("token") UUID token,
                    @Param("expiration") LocalDateTime expiration,
                    @Param("email") String email);

}
