package com.merkury.vulcanus.account.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {

    private String email;
    private String username;
    private String password;

    public User toUser() {
        return User.builder()
                .email(email)
                .username(username)
                .password(password)
                .build();
    }
}
