package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;
    private final PasswordEncoder passwordEncoder;

    public void editUserSettings() throws UserNotFoundByUsernameException {

    }

    private void changeUserPassword(String username, String oldPassword, String newPassword, String confirmPassword) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(username);

        if (!user.getProvider().equals(Provider.NONE)){
//            throw new
        }

        if (passwordEncoder.matches(oldPassword, user.getPassword()) && newPassword.equals(confirmPassword)){
            user.setPassword(passwordEncoder.encode(newPassword));
        }
    }

    private void changeUserEmail(String username, String email) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(username);

        if (userEntityRepository.findAllByEmail(email).size() > 1){
//            throw new
        }

        user.setEmail(email);
        userEntityRepository.save(user);
    }

    private void changeUserUsername(String oldUsername, String newUsername) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(oldUsername);

        if (userEntityRepository.findAllByUsername(newUsername).size() > 0){
//            throw new
        }

        user.setUsername(newUsername);
        userEntityRepository.save(user);
    }
}
