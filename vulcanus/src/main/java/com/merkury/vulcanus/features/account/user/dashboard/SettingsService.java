package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.user.UserEditDataDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtService;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void editUserSettings(HttpServletResponse response, UserEditDataDto userEdit) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, UsernameTakenException, SameUsernameException, EmailTakenException, SameEmailException, SamePasswordException, InvalidPasswordException {
        var username = userEdit.username();

        var user = userEntityFetcher.getByUsername(username);
        var userId = user.getId();

        if (!user.getProvider().equals(Provider.NONE)) {
            throw new ExternalProviderAccountException();
        }

        switch (userEdit.type()) {
            case USERNAME -> changeUserUsername(user, username);
            case EMAIL -> changeUserEmail(user, userEdit.email());
            case PASSWORD -> changeUserPassword(user, userEdit.oldPassword(), userEdit.newPassword(), userEdit.confirmPassword());
            default -> throw new UnsupportedUserSettingsType(userEdit.type());
        }

        var userFromDb = userEntityFetcher.getById(userId);
        jwtService.refreshUserToken(userFromDb, response);
    }

    private void changeUserPassword(UserEntity user, String oldPassword, String newPassword, String confirmPassword) throws InvalidPasswordException, SamePasswordException {

        String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S){8,16}$";
        Pattern pattern = Pattern.compile(passwordRegex);

        if (newPassword == null || !pattern.matcher(newPassword).matches()) {
            throw new InvalidPasswordException("Password must be 8-16 characters long, contain at least one digit, one uppercase letter, one lowercase letter, and one special character.");
        }

        if (passwordEncoder.matches(user.getPassword(), newPassword)) {
            throw new SamePasswordException();
        }

        if (passwordEncoder.matches(oldPassword, user.getPassword()) && newPassword.equals(confirmPassword)) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userEntityRepository.save(user);
        }
    }

    private void changeUserEmail(UserEntity user, String email) throws EmailTakenException, SameEmailException {
        if (!userEntityRepository.findAllByEmail(email).isEmpty()) {
            throw new EmailTakenException();
        }

        if (user.getEmail().equals(email)) {
            throw new SameEmailException();
        }

        user.setEmail(email);
        userEntityRepository.save(user);
    }

    private void changeUserUsername(UserEntity user, String newUsername) throws UsernameTakenException, SameUsernameException {
        if (!userEntityRepository.findAllByUsername(newUsername).isEmpty()) {
            throw new UsernameTakenException();
        }

        if (user.getUsername().equals(newUsername)) {
            throw new SameUsernameException();
        }

        user.setUsername(newUsername);
        userEntityRepository.save(user);
    }
}
