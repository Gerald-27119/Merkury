package com.merkury.vulcanus.security.jwt.refresh;

import com.merkury.vulcanus.security.jwt.exception.IsNotAccessTokenException;
import com.merkury.vulcanus.security.jwt.exception.RefreshTokenExpiredException;
import com.merkury.vulcanus.security.jwt.exception.UsernameIsNotIdenticalException;
import com.merkury.vulcanus.security.jwt.refresh.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/security")
@RequiredArgsConstructor
public class JwtController {
    private final JwtService jwyService;

    /**
     * @return ok (200) and new access token in Authorization header
     *or Unauthorized (401) if refresh token is invalid
     */
    @GetMapping("/refresh")
    public ResponseEntity<String> refreshAccessToken(HttpServletRequest request)
            throws RefreshTokenExpiredException, UsernameIsNotIdenticalException, IsNotAccessTokenException {
        String accessToken = jwyService.refreshAccessToken(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .build();
    }
}
