package com.merkury.vulcanus.account.password.reset.token.service;

import com.merkury.vulcanus.account.password.reset.token.PasswordResetTokenRepository;
import com.merkury.vulcanus.account.password.reset.token.PasswordResetToken;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenNotFoundException;
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


    private UUID generateToken() {
        return UUID.randomUUID();
    }

    private void deleteOldToken(UserEntity user) {
        if (user.getPasswordResetToken() != null) {
            PasswordResetToken oldToken = user.getPasswordResetToken();
            user.setPasswordResetToken(null);
            userEntityRepository.save(user);
            passwordResetTokenRepository.delete(oldToken);
        }
    }

    public PasswordResetToken changeToken(UserEntity user) {
        UUID token = generateToken();
        deleteOldToken(user);

        LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken newToken = new PasswordResetToken(token, expirationDate, user);
        saveToken(newToken);

        return newToken;
    }

    private void saveToken(PasswordResetToken passwordResetToken) {
        UserEntity user = passwordResetToken.getUser();
        passwordResetTokenRepository.save(passwordResetToken);

        user.setPasswordResetToken(passwordResetToken);
        userEntityRepository.save(user);
    }

    public boolean isTokenValid(PasswordResetToken token) {
        return !token.getExpirationDate().isBefore(LocalDateTime.now());
    }

    public String getEmailByToken(UUID token) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token).orElseThrow(PasswordResetTokenNotFoundException::new);

        if (isTokenValid(resetToken)) {
            UserEntity user = resetToken.getUser();
            return user.getEmail();
        }
        throw new PasswordResetTokenIsInvalidException();
    }
}
