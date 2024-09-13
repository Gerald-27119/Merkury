package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.user.Role;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class RegisterService {

    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException, UsernameTakenException {
        checkIfCredentialsTaken(userDto.email(), userDto.username());
        var user = mapToUser(userDto);
        userEntityRepository.save(user);
    }

    public void registerOauth2User(String email, String username)
            throws UsernameTakenException, EmailTakenException {
        checkIfCredentialsTaken(email, username);
        UserEntity user = UserEntity.builder()
                .email(email)
                .username(username)
                .role(Role.USER)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .accountNonExpired(true)
                .build();
        userEntityRepository.save(user);
    }

    private UserEntity mapToUser(UserRegisterDto userDto) {
        return UserEntity.builder()
                .username(userDto.username())
                .email(userDto.email())
                .password(passwordEncoder.encode(userDto.password()))
                .role(Role.USER)
                .build();
    }

    private void checkIfCredentialsTaken(String userEmail, String username)
            throws EmailTakenException, UsernameTakenException {
        if (userEntityRepository.existsByEmail(userEmail)) {
            throw new EmailTakenException();
        }
        if (userEntityRepository.existsByUsername(username)) {
            throw new UsernameTakenException();
        }
    }

}
