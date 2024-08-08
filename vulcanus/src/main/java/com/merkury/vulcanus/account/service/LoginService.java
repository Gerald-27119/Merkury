package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class LoginService {

    private final AuthenticationManager authenticationManager;
    private final JwtGenerator jwtGenerator;

    public String loginUser(UserLoginDto userDto) throws InvalidCredentialsException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDto.username(),
                            userDto.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return jwtGenerator.generateToken(authentication);
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException();
        }
    }

}