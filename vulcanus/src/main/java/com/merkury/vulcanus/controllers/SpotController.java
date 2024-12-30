package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/spot")
@RequiredArgsConstructor
public class SpotController {

    private final SpotService spotService;

    @GetMapping("")
    public ResponseEntity<List<SpotDto>> getAllSpots() {
        return ResponseEntity.ok(spotService.getAllSpots());
    }

    @GetMapping("/{spotId}")
    public ResponseEntity<SpotDto> getSpotById(@PathVariable("spotId") Long id) throws SpotNotFoundException {
        return ResponseEntity.ok(spotService.getSpotById(id));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId,
                                                @AuthenticationPrincipal UserDetails userDetails)
                                                throws CommentNotFoundException, InvalidCredentialsException {
        log.info("Deleting comment, id:" + commentId + "...");
        spotService.deleteComment(commentId, userDetails.getUsername());
        log.info("Deleted comment successfully! id:" + commentId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{commentId}")
    public ResponseEntity<String> editComment(@PathVariable Long commentId,
                                              @RequestBody String text,
                                              @AuthenticationPrincipal UserDetails userDetails)
                                              throws CommentNotFoundException, InvalidCredentialsException {
        log.info("Editing comment, id:" + commentId + "...");
        spotService.editComment(commentId, text, userDetails.getUsername());
        log.info("Edited comment successfully! id:" + commentId + "!");
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("{spotId}/add")
    public ResponseEntity<String> addComment(@RequestBody String text,
                                             @PathVariable Long spotId,
                                             @AuthenticationPrincipal UserDetails userDetails)
                                             throws CommentNotFoundException, SpotNotFoundException {
        log.info("Submitting new comment...");
        spotService.addComment(text, userDetails.getUsername(), spotId);
        log.info("Edited comment successfully! spot id:" + spotId + "!");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }


}
