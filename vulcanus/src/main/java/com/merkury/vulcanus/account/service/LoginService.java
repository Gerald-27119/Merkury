package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class LoginService {

    private final UserRepository userRepository;

    public void loginUser(UserDto userDto)  {

        //zwrocic JWT token

    }

}