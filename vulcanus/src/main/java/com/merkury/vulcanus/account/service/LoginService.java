package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.LoginResponseDto;
import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class LoginService {

    private final UserEntityRepository userEntityRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtGenerator jwtGenerator;
    private final PasswordEncoder passwordEncoder;

    public String loginUser(UserLoginDto userDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDto.username(),
                        userDto.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);
    }
}