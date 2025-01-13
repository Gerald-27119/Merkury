package com.merkury.vulcanus.features.spot;


import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.mappers.CommentMapper;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserEntityRepository userEntityRepository;
    private final JwtManager jwtManager;
    private final SpotRepository spotRepository;


    public void addComment(String text, Long spotId, HttpServletRequest request) throws SpotNotFoundException, UserNotFoundException {

        String token = jwtManager.getJWTFromCookie(request);
        String jwtUsername = jwtManager.getUsernameFromJWT(token);
        UserEntity user = userEntityRepository.findByUsername(jwtUsername).orElseThrow(() -> new UserNotFoundException(jwtUsername));
        Spot spot = spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));

        commentRepository.save(Comment.builder()
                .text(text)
                .rating(0.0)
                .likes(0)
                .spot(spot)
                .publishDate(LocalDateTime.now())
                .author(user)
                .build());
    }

    public void editComment(Long commentId, String text, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
        String token = jwtManager.getJWTFromCookie(request);
        String jwtUsername = jwtManager.getUsernameFromJWT(token);

        String commentAuthor = comment.getAuthor().getUsername();

        if(!commentAuthor.equals(jwtUsername))
            throw new InvalidCredentialsException();

        comment.setText(text);
        commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
        String token = jwtManager.getJWTFromCookie(request);
        String jwtUsername = jwtManager.getUsernameFromJWT(token);

        String commentAuthor = comment.getAuthor().getUsername();

        if(!commentAuthor.equals(jwtUsername))
            throw new InvalidCredentialsException();

        commentRepository.deleteById(commentId);
    }

    public List<CommentDto> getCommentsBySpotId(Long spotId) throws SpotNotFoundException {
        spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
        return commentRepository.findAllCommentsBySpotIdOrderByPublishDateDesc(spotId).stream().map(CommentMapper::toDto).toList();
    }
}
