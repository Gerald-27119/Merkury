package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.user.UserDto;
import com.merkury.vulcanus.account.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class RegisterService {

    private final UserRepository userRepository;

    public void registerUser(UserDto userDto)  {
        return;
    }

}
