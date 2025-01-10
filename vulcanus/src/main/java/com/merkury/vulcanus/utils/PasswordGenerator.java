package com.merkury.vulcanus.utils;

import java.security.SecureRandom;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class PasswordGenerator {

    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "@$!%*?&";
    private static final String ALL_CHARACTERS = LOWERCASE + UPPERCASE + DIGITS + SPECIAL_CHARACTERS;
    private static final int LENGTH = 16;

    public String generate() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(getRandomCharacter(LOWERCASE, random));
        password.append(getRandomCharacter(UPPERCASE, random));
        password.append(getRandomCharacter(DIGITS, random));
        password.append(getRandomCharacter(SPECIAL_CHARACTERS, random));

        for (int i = 4; i < LENGTH; i++) {
            password.append(getRandomCharacter(ALL_CHARACTERS, random));
        }

        return this.shufflePassword(password.toString(), random);
    }

    private char getRandomCharacter(String characters, SecureRandom random) {
        int index = random.nextInt(characters.length());
        return characters.charAt(index);
    }

    private String shufflePassword(String password, SecureRandom random) {
        char[] passwordArray = password.toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }
        return new String(passwordArray);
    }
}
