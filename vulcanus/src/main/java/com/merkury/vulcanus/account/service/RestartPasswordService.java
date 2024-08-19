package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestartPasswordService {
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    public void checkIfUserToResetPasswordExists(String emailAddress) {
        if (!userEntityRepository.existsByEmail(emailAddress)) {
            throw new UserNotFoundException("User with provided email address doesn't exist!");
        }
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) {
        if (!userEntityRepository.existsByUsername(userPasswordResetDto.username())) {
            throw new UserNotFoundException("User with provided username doesn't exist!");
        }

        //TODO:validate password

        var userFromDb = userEntityRepository.findByUsername(userPasswordResetDto.username());

        var user = userFromDb.get();

        user.setPassword(passwordEncoder.encode(userPasswordResetDto.password()));
        userEntityRepository.save(user);
    }
}
