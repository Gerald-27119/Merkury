package com.merkury.vulcanus.map;

import com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/map")
@RequiredArgsConstructor
@InvocationsCounter
public class MapController {

    @GetMapping("/test")
    public ResponseEntity<String> registerUser() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Test");
    }
}
