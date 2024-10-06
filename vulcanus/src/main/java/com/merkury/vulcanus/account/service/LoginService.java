package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.user.UserEntity;
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

import static com.merkury.vulcanus.security.jwt.TokenType.ACCESS;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;

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

            String refreshToken = jwtGenerator.generateToken(authentication, REFRESH);
            jwtManager.addTokenToCookie(response, refreshToken, REFRESH);

            String accessToken = jwtGenerator.generateToken(authentication, ACCESS);
            jwtManager.addTokenToCookie(response, accessToken, ACCESS);
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException();
        }
    }

    public String loginOauth2User(UserEntity user) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(user.getUsername(), null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        return jwtGenerator.generateToken(authenticationToken, ACCESS);
    }

}