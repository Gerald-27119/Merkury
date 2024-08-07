package com.merkury.vulcanus.account;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * @param userRegisterDto the user registration details containing:
     *                         <ul>
     *                          <li>email
     *                          <li>username
     *                          <li>password
     *                        </ul>
     * @return HTTP status 201 (Created) or 409 (Conflict) if the email is already taken
     */
    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody UserRegisterDto userRegisterDto) throws EmailTakenException {
        accountService.registerUser(userRegisterDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
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
    public ResponseEntity<Void> loginUser(@RequestBody UserLoginDto userLoginDto) {
        var jwt = accountService.loginUser(userLoginDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
                .build();
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("test");
    }

}