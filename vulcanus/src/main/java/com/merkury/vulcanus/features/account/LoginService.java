package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.model.dtos.user.UserLoginDto;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletResponse;
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
    private final JwtManager jwtManager;

    public void loginUser(UserLoginDto userDto, HttpServletResponse response) throws InvalidCredentialsException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDto.username(),
                            userDto.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            jwtManager.addTokenToCookie(response, jwtGenerator.generateToken());
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException();
        }
    }

    public void loginOauth2User(UserEntity user, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user.getUsername(), null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        jwtManager.addTokenToCookie(response, jwtGenerator.generateToken());

    }

}