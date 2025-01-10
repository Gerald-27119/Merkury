package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.CommentAddDto;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.CommentEditDto;
import com.merkury.vulcanus.model.dtos.SpotDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/comment/add")
    public ResponseEntity<String> addComment(@RequestBody CommentAddDto commentAddDto,
                                                       HttpServletRequest request)
            throws CommentNotFoundException, SpotNotFoundException {
        log.info("Submitting new comment...");
        spotService.addComment(commentAddDto.text(),  commentAddDto.spotId(), request);
        log.info("Edited comment successfully! spot id:" + commentAddDto.spotId() + "!");
        return ResponseEntity
                .ok().build();
    }

    @PostMapping("/comment/edit")
    public ResponseEntity<String> editComment(@RequestBody CommentEditDto commentEditDto,
                                                        HttpServletRequest request)
            throws CommentNotFoundException, InvalidCredentialsException {

        log.info("Editing comment, id:" + commentEditDto.commentId() + "...");
        spotService.editComment(commentEditDto.commentId(), commentEditDto.text() , request);
        log.info("Edited comment successfully! id:" + commentEditDto.commentId() + "!");
        return ResponseEntity
                .ok().build();
    }

    @PostMapping("/comment/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable("commentId") Long commentId,
                                                          HttpServletRequest request)
            throws CommentNotFoundException, InvalidCredentialsException {
        log.info("Deleting comment, id:" + commentId + "...");
        spotService.deleteComment(commentId, request);
        log.info("Deleted comment successfully! id:" + commentId);
        return ResponseEntity
                .ok().build();
    }
}