package com.merkury.vulcanus.features.spot;


import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserEntityRepository userEntityRepository;

    public Comment editComment(Long commentId, String text, String username) throws CommentNotFoundException, InvalidCredentialsException {
        Comment comment = commentRepository.findById(commentId).orElse(null);
        assert comment != null;
        String validUsername = comment.getAuthor().getUsername();
        if(!comment.getAuthor().getUsername().equals(username))
            throw new InvalidCredentialsException();
        comment.setText(text);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String username) throws CommentNotFoundException, InvalidCredentialsException {
        Comment comment = commentRepository.findById(commentId).orElse(null);
        assert comment != null;
        if(!comment.getAuthor().getUsername().equals(username))
            throw new InvalidCredentialsException();

        commentRepository.deleteById(commentId);
    }

    public Comment addComment(String text, UserEntity user, Spot spot){
        return commentRepository.save(Comment.builder()
                .text(text)
                .rating(0.0)
                .likes(0)
                .spot(spot)
                .publishDate(LocalDate.now())
                .author(user)
                .build());
    }

//    public List<Comment> getCommentsBySpot(Spot spot) {
//        return commentRepository.findAllBySpot(spot);
//    }
//
//    public List<Comment> getCommentsByAuthor(UserEntity author) {
//        return commentRepository.findAllByAuthor(author);
//    }
}
