package com.merkury.account.user;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void builderBuildsUserEntityCorrectly() {
        //given
        int id = 1;
        String name = "Karol";
        String surname = "Wojtyła";
        String email = "karol@merkury.com";
        String password = "password";
        //when
        var user = User.builder()
                .id(id)
                .name(name)
                .surname(surname)
                .email(email)
                .password(password)
                .build();

        //then
        assertEquals(user.getId(), id);
        assertEquals(user.getName(), name);
        assertEquals(user.getEmail(), email);
        assertEquals(user.getPassword(), password);
    }
}