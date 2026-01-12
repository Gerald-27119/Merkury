package com.merkury.vulcanus.features.password.reset;

import com.merkury.vulcanus.model.repositories.PasswordResetTokenRepository;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenNotFoundException;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private UUID generateToken() {
        return UUID.randomUUID();
    }

    @Transactional
    public PasswordResetToken changeToken(UserEntity user) {
        UUID token = generateToken();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);

        passwordResetTokenRepository.upsertToken(token, expiration, user.getEmail());

        return passwordResetTokenRepository.findByUserEmail(user.getEmail()).get();
    }

    public boolean isTokenValid(PasswordResetToken token) {
        return !token.getExpirationDate().isBefore(LocalDateTime.now());
    }

    public String getEmailByToken(UUID token) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token).orElseThrow(PasswordResetTokenNotFoundException::new);

        if (isTokenValid(resetToken)) {
            return resetToken.getUserEmail();
        }
        throw new PasswordResetTokenIsInvalidException();
    }
}
