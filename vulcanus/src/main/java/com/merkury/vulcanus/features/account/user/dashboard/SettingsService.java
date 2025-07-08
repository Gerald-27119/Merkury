package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.mappers.user.dashboard.SettingsMapper;
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

    public UserDataDto getUserData(String username) throws UserNotFoundByUsernameException {
        return SettingsMapper.toDto(userEntityFetcher.getByUsername(username));
    }

    public void editUserSettings(HttpServletResponse response, UserEditDataDto userEdit, String username) throws UserNotFoundByUsernameException, UserNotFoundException, ExternalProviderAccountException, UnsupportedUserSettingsType, UsernameTakenException, SameUsernameException, EmailTakenException, SameEmailException, SamePasswordException, InvalidPasswordException {
        var user = userEntityFetcher.getByUsername(username);
        var userId = user.getId();

        if (!user.getProvider().equals(Provider.NONE)) {
            throw new ExternalProviderAccountException();
        }

        switch (userEdit.type()) {
            case USERNAME -> changeUserUsername(user, userEdit.username());
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
        if (user.getEmail().equals(email)) {
            throw new SameEmailException();
        }

        if (!userEntityRepository.findAllByEmail(email).isEmpty()) {
            throw new EmailTakenException();
        }

        user.setEmail(email);
        userEntityRepository.save(user);
    }

    private void changeUserUsername(UserEntity user, String newUsername) throws UsernameTakenException, SameUsernameException {
        if (user.getUsername().equals(newUsername)) {
            throw new SameUsernameException();
        }

        if (!userEntityRepository.findAllByUsername(newUsername).isEmpty()) {
            throw new UsernameTakenException();
        }

        user.setUsername(newUsername);
        userEntityRepository.save(user);
    }
}
