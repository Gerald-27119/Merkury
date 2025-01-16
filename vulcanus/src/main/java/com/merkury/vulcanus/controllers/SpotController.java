package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.features.spot.SpotService;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.CommentAddDto;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.CommentEditDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SpotController {

    private final SpotService spotService;
    @GetMapping("/public/spot/{spotId}")
    public ResponseEntity<SpotDetailsDto> getSpotById(@PathVariable("spotId") Long id) throws SpotNotFoundException {
        log.info("getting spot with id: {}", id);
        return ResponseEntity.ok(spotService.getSpotById(id));
    }

    @GetMapping("/public/spot/comments")
    public ResponseEntity<Page<CommentDto>> getCommentsBySpotId(@RequestParam Long spotId, @RequestParam int page, @RequestParam int size) throws SpotNotFoundException {
        return ResponseEntity.ok(spotService.getCommentsPageBySpotId(spotId, page, size));
    }

    @PostMapping("/spot/comment")
    public ResponseEntity<String> addComment(@RequestBody CommentAddDto commentAddDto,
                                                       HttpServletRequest request)
            throws CommentNotFoundException, SpotNotFoundException {
        log.info("Submitting new comment...");
        spotService.addComment(commentAddDto.text(),  commentAddDto.spotId(), request);
        log.info("Edited comment successfully! spot id:" + commentAddDto.spotId() + "!");
        return ResponseEntity
                .ok().build();
    }

    @PatchMapping("/spot/comment")
    public ResponseEntity<String> editComment(@RequestBody CommentEditDto commentEditDto,
                                                        HttpServletRequest request)
            throws CommentNotFoundException, InvalidCredentialsException {

        log.info("Editing comment, id:" + commentEditDto.commentId() + "...");
        spotService.editComment(commentEditDto.commentId(), commentEditDto.text() , request);
        log.info("Edited comment successfully! id:" + commentEditDto.commentId() + "!");
        return ResponseEntity
                .ok().build();
    }

    @DeleteMapping("/spot/comment/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable("commentId") Long commentId,
                                                          HttpServletRequest request)
            throws CommentNotFoundException, InvalidCredentialsException {
        log.info("Deleting comment, id:" + commentId + "...");
        spotService.deleteComment(commentId, request);
        log.info("Deleted comment successfully! id:" + commentId);
        return ResponseEntity
                .ok().build();
    }

    @GetMapping("/public/spot/filter")
    public ResponseEntity<List<GeneralSpotDto>> getFilteredSpots(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Double minRating,
            @RequestParam(defaultValue = "5") Double maxRating) throws SpotsNotFoundException {
        log.info("getting filtered spots");
        return ResponseEntity.ok(spotService.getFilteredSpots(name, minRating, maxRating));
    }

    @GetMapping("/public/spot/names")
    public ResponseEntity<List<String>> getFilteredSpotsNames(@RequestParam(defaultValue = "") String text) throws SpotsNotFoundException {
        log.info("getting spots names");
        return ResponseEntity.ok(spotService.getFilteredSpotsNames(text));
    }
}
