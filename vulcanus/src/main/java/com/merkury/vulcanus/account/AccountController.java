package com.merkury.vulcanus.account;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.service.AccountService;
import com.merkury.vulcanus.email.service.EmailService;
import com.merkury.vulcanus.properties.UrlsProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@Slf4j
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final EmailService emailService;
    private final String USER_REGISTERED_MESSAGE = "Thank you for registering in our service!\nYour account is now active.";
    private final String USER_REGISTERED_TITLE = "Register confirmation";
    private final UrlsProperties urlsProperties;
    private final int COOKIE_MAX_AGE = 60 * 15; //15 minutes

    /**
     * @param userRegisterDto the user registration details containing:
     *                         <ul>
     *                          <li>email
     *                          <li>username
     *                          <li>password
     *                        </ul>
     * @return HTTP status 201 (Created) or 409 (Conflict) if the email or username is taken
     */

    @PostMapping("/register")

    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto) throws EmailTakenException, UsernameTakenException {

        accountService.registerUser(userRegisterDto);
        emailService.sendEmail(userRegisterDto.email(), USER_REGISTERED_TITLE, USER_REGISTERED_MESSAGE);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    /**
     * @param userLoginDto the user login details containing:
     *                     <ul>
     *                      <li>username
     *                      <li>password
     *                     </ul>
     * @return HTTP status 200 (OK) and the JWT token in the Authorization header
     * or 401 (Unauthorized) if the credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) throws InvalidCredentialsException {

        var jwt = accountService.loginUser(userLoginDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
                .build();
    }

    @GetMapping("/login-success")
    public RedirectView loginSuccess(HttpServletResponse response, OAuth2AuthenticationToken oAuth2Token) throws EmailTakenException, UsernameTakenException {

        var loginResponseDto = accountService.handleOAuth2User(oAuth2Token);
        var jwt = loginResponseDto.jwt();
        var userEmail = loginResponseDto.userEmail();

        emailService.sendEmail(userEmail, USER_REGISTERED_TITLE, USER_REGISTERED_MESSAGE);

        Cookie jwtCookie = new Cookie("jwt", jwt);
        jwtCookie.setHttpOnly(true);
        //TODO: IMPORTANT! WHEN IN PRODUCTION MUST BE SET TO TRUE,
        // COOKIE WILL BE SENT ONLY OVER HTTPS
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(COOKIE_MAX_AGE);
        response.addCookie(jwtCookie);

        var afterLoginPageUrl = urlsProperties.getAfterLoginPageUrl();
        return new RedirectView(afterLoginPageUrl);
    }

    @GetMapping("/forget-password")
    public ResponseEntity<String> forgetPasswordSendEmail(@RequestParam String email) {
        accountService.checkIfUserToResetPasswordExists(email);
        //TODO: provide valid link
        String resetLink = "reset-password";
        String message = "Click this link to reset password: <a href='" + resetLink + "'>New password</a>";
        emailService.sendEmail(email, "Restart password", message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password reset link sent to: " + email);
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<String> setNewPassword(@Valid @RequestBody UserPasswordResetDto userPasswordResetDto) {
        accountService.restartUserPassword(userPasswordResetDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password set successfully for user: " + userPasswordResetDto.username());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("test");
    }
}