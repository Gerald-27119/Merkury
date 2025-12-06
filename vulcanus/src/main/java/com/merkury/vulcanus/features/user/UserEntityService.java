package com.merkury.vulcanus.features.user;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserEntityService {

    private final UserEntityRepository userRepository;

    public List<String> searchUsers(String username) {
        return userRepository.findTop10ByUsernameContainingIgnoreCase(username).stream().map(UserEntity::getUsername).toList();
    }
}
