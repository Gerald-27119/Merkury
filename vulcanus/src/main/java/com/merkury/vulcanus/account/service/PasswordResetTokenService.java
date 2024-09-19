package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.tokens.passwordResetToken.PasswordResetToken;
import com.merkury.vulcanus.account.tokens.passwordResetToken.PasswordResetTokenRepository;
import com.merkury.vulcanus.account.tokens.passwordResetToken.exception.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.account.tokens.passwordResetToken.exception.PasswordResetTokenNotFoundException;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserEntityRepository userEntityRepository;


    public PasswordResetToken generateToken(UserEntity user) {
        UUID token;
        boolean tokenUnique;

        do {
            token = UUID.randomUUID();
            tokenUnique = passwordResetTokenRepository.findByToken(token).isEmpty();
        } while (!tokenUnique);

        LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(15);
        return new PasswordResetToken(token, expirationDate, user);
    }

    public void saveToken(PasswordResetToken passwordResetToken) {
        passwordResetTokenRepository.save(passwordResetToken);
    }

    public boolean isTokenValid(PasswordResetToken token) {
        return !token.getExpirationDate().isBefore(LocalDateTime.now());
    }

    public String getEmailByToken(UUID token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token).orElseThrow(PasswordResetTokenNotFoundException::new);

        if (isTokenValid(resetToken)) {
            UserEntity user = resetToken.getUser();
            return user.getEmail();
        }
        throw new PasswordResetTokenIsInvalidException();
    }
}
