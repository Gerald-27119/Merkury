package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter;
import jakarta.validation.Valid;
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
@InvocationsCounter
public class TestController {

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
}
