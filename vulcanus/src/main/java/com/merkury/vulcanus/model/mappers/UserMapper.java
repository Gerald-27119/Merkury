package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.user.UserRegisterDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserMapper {

    private UserMapper() {
    }

    public static UserEntity toEntity(@NotNull UserRegisterDto userRegisterDto,
                                      @NotNull PasswordEncoder passwordEncoder) {
        return UserEntity.builder()
                .username(userRegisterDto.username())
                .email(userRegisterDto.email())
                .password(passwordEncoder.encode(userRegisterDto.password()))
                .userRole(UserRole.ROLE_USER)
                .provider(Provider.NONE)
                .build();
    }
}
