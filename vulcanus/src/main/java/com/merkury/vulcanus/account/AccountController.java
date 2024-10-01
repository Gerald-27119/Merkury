package com.merkury.vulcanus.account;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.account.password.reset.token.exception.PasswordResetTokenNotFoundException;
import com.merkury.vulcanus.account.service.RestartPasswordService;
import com.merkury.vulcanus.account.service.AccountService;
import com.merkury.vulcanus.account.password.reset.token.service.PasswordResetTokenService;
import com.merkury.vulcanus.account.password.reset.token.PasswordResetToken;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.email.service.EmailService;
import com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
@InvocationsCounter
public class AccountController {

    private final AccountService accountService;
    private final EmailService emailService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final RestartPasswordService restartPasswordService;
    @Value("${reset.password.link}")
    private String resetPasswordLink;

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
        String message = "Thank you for registering in our service!\nYour account is now active.";
        emailService.sendEmail(userRegisterDto.email(), "Register confirmation", message);
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
     * @return HTTP status 200 (OK) and the JWT tokens in the http only cookies
     * or 401 (Unauthorized) if the credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) throws InvalidCredentialsException {

        accountService.loginUser(userLoginDto, response);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPasswordSendEmail(@RequestBody String email) {
        UserEntity user = restartPasswordService.getUserByEmail(email);
        PasswordResetToken resetToken = passwordResetTokenService.changeToken(user);

        String resetLink = resetPasswordLink + resetToken.getToken().toString();
        String message = "Click this link to reset password: <a href='" + resetLink + "'>New password</a>";

        emailService.sendEmail(email, "Restart password", message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password reset link sent to: " + email);
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<String> setNewPassword(@Valid @RequestBody UserPasswordResetDto userPasswordResetDto) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        accountService.restartUserPassword(userPasswordResetDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password set successfully!");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("test");
    }

}