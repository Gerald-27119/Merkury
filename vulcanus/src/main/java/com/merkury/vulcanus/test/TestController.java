package com.merkury.vulcanus.test;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/public/test")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Public test endpoint says hello!");
    }

    @GetMapping("/private/test")
    public ResponseEntity<String> privateEndpoint() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Private test endpoint says hello!");
    }

    @GetMapping("/public/test/service")
    public ResponseEntity<String> publicEndpointWithServiceCall() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(testService.getTest());
    }

}
