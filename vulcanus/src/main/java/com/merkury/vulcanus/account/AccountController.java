package com.merkury.vulcanus.account;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.service.AccountService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    jakarta.validation.Validator validator = factory.getValidator();


    private final AccountService accountService;

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

    public ResponseEntity<String> registerUser(/*@Valid*/ @RequestBody UserRegisterDto userRegisterDto) throws EmailTakenException, UsernameTakenException {
        Set<ConstraintViolation<UserRegisterDto>> registerViolations = validator.validate(userRegisterDto);
        if(registerViolations.isEmpty()) {
            accountService.registerUser(userRegisterDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("User registered successfully");
        }
        StringBuilder validationMessage = new StringBuilder();
        for(ConstraintViolation<UserRegisterDto> violation : registerViolations){
            validationMessage.append(violation.getMessage()).append("\n");
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(validationMessage.toString());
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
    public ResponseEntity<String> loginUser(@RequestBody UserLoginDto userLoginDto) throws InvalidCredentialsException {
        Set<ConstraintViolation<UserLoginDto>> loginViolations = validator.validate(userLoginDto);
        if(loginViolations.isEmpty()) {
            var jwt = accountService.loginUser(userLoginDto);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
                    .build();
        }
        StringBuilder validationMessage = new StringBuilder();
        for(ConstraintViolation<UserLoginDto> violation : loginViolations){
            validationMessage.append(violation.getMessage()).append("\n");
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(validationMessage.toString());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("test");
    }

}