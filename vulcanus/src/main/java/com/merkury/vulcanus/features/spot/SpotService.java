package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final UserEntityRepository userEntityRepository;
    private final SpotRepository spotRepository;
    private final CommentService commentService;


    public List<SpotDto> getAllSpots() {
        return spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
    }

    public SpotDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public Comment addComment(String text, String username, Long spotId) throws SpotNotFoundException, UserNotFoundException {
        Spot spot = spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
        UserEntity user = userEntityRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        return commentService.addComment(text, user, spot);
    }

    public Comment editComment(Long commentId, String text, String username) throws CommentNotFoundException, InvalidCredentialsException {
        return commentService.editComment(commentId, text, username);
    }

    public void deleteComment(Long commentId, String username) throws CommentNotFoundException, InvalidCredentialsException {
        commentService.deleteComment(commentId, username);
    }

}
