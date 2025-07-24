package com.merkury.vulcanus.utils.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserEntityFetcher {
    private final UserEntityRepository userEntityRepository;

    public UserEntity getByUsername(String username) throws UserNotFoundByUsernameException {
        return userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
    }

    public UserEntity getById(Long id) throws UserNotFoundException {
        return userEntityRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with this id " + id));
    }
}
