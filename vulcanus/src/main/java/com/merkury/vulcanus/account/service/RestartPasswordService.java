package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenNotFoundException;
import com.merkury.vulcanus.account.password.reset.token.service.PasswordResetTokenService;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestartPasswordService {
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenService passwordResetTokenService;

    public UserEntity getUserByEmail(String email) {
        Optional<UserEntity> userFromDb = userEntityRepository.findByEmail(email);
        if (userFromDb.isEmpty()) {
            throw new UserNotFoundException("User with provided email doesn't exist!");
        }
        return userFromDb.get();
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        UUID token = UUID.fromString(userPasswordResetDto.token());
        String email = passwordResetTokenService.getEmailByToken(token);

        Optional<UserEntity> userFromDb = userEntityRepository.findByEmail(email);
        if (userFromDb.isEmpty()) {
            throw new UserNotFoundException("User with provided email doesn't exist!");
        }
        UserEntity user = userFromDb.get();

        user.setPassword(passwordEncoder.encode(userPasswordResetDto.password()));
        userEntityRepository.save(user);
    }
}
