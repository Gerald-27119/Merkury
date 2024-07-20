package com.merkury.account.user;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void builderBuildsUserEntityCorrectly() throws InterruptedException {
        //given
        int id = 1;
        String name = "Karol";
        String surname = "Wojtyła";
        String email = "karol@merkury.com";
        String password = "password";

        Thread testThread = new Thread(() -> {
            try {//TODO: Remove this sleep
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        testThread.start();
        testThread.join(); // Wait for the thread to finish

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