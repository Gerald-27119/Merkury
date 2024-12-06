package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.model.dtos.UserRegisterDto;
import com.merkury.vulcanus.exception.excpetions.EmailTakenException;
import com.merkury.vulcanus.exception.excpetions.UsernameTakenException;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
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

    public void registerOauth2User(String email, String username, String provider)
            throws UsernameTakenException, EmailTakenException {
        checkIfCredentialsTaken(email, username);
        Provider authProvider = Provider.valueOf(provider.toUpperCase());
        UserEntity user = UserEntity.builder()
                .email(email)
                .username(username)
                .userRole(UserRole.ROLE_USER)
                .provider(authProvider)
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
                .userRole(UserRole.ROLE_USER)
                .provider(Provider.NONE)
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
