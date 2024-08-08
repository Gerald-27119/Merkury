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
        if (userEntityRepository.existsByEmail(userDto.email())) {
            throw new EmailTakenException();
        }
        if(userEntityRepository.existsByUsername(userDto.username())) {
            throw new UsernameTakenException();
        }
        var user = mapToUser(userDto);
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
}
