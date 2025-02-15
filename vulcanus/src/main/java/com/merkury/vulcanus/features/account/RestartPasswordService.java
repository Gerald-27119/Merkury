package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.user.UserPasswordResetDto;
import com.merkury.vulcanus.features.password.reset.PasswordResetTokenService;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
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

    public void throwIfUserNotNative(UserEntity user) throws InvalidProviderException {
        if (!user.getProvider().equals(Provider.NONE)) {
            throw new InvalidProviderException(user.getProvider().toString());
        }
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
