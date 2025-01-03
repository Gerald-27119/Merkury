package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final CommentService commentService;

    public List<SpotDto> getAllSpots() {
        return spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
    }

    public SpotDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public List<CommentDto> addComment(String text, Long spotId, HttpServletRequest request) throws SpotNotFoundException, UserNotFoundException {
        return commentService.addComment(text, spotId, request);
    }

    public List<CommentDto> editComment(Long commentId, String text, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        return commentService.editComment(commentId, text, request);
    }

    public List<CommentDto> deleteComment(Long commentId, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        return commentService.deleteComment(commentId, request);
    }

}
