package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestartPasswordService {
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    //TODO: String email = tokenService.getEmailByToken(userPasswordResetDto.token());

    public void checkIfUserToResetPasswordExists(String emailAddress) {
        if (!userEntityRepository.existsByEmail(emailAddress)) {
            throw new UserNotFoundException("User with provided email address doesn't exist!");
        }
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) {
        if (!userEntityRepository.existsByEmail(userPasswordResetDto.email())) {
            throw new UserNotFoundException("User with provided email doesn't exist!");
        }

        //TODO:validate password

        Optional<UserEntity> userFromDb = userEntityRepository.findByEmail(userPasswordResetDto.email());
        if (userFromDb.isEmpty()) throw new UserNotFoundException("User with provided email doesn't exist!");
        UserEntity user = userFromDb.get();

        user.setPassword(passwordEncoder.encode(userPasswordResetDto.password()));
        userEntityRepository.save(user);
    }
}
