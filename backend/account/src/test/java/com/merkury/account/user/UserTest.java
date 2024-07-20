package com.merkury.account.user;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void builderBuildsUserEntityCorrectly() throws InterruptedException {
        //given
        Long id = 1L;
        String name = "Karol";
        String email = "karol@merkury.com";
        String password = "password";

        Thread testThread = new Thread(() -> {
            try {
                // Simulate long running process
                Thread.sleep(25000);
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