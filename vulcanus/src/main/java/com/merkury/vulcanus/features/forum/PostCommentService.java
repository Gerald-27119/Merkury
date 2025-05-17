package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.repositories.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.PostRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final UserDataService userDataService;
    private final VoteService voteService;

//TODO: implement service for post comments, reduce comment services if possible
    public void addComment(HttpServletRequest request, Long commentId){

    }

    public void deleteComment(HttpServletRequest request, Long commentId){

    }

    public void editComment(HttpServletRequest request, Long commentId){

    }

    public void voteComment(HttpServletRequest request, Long commentId, boolean isUpvote){

    }

    public void replyToComment(HttpServletRequest request, Long commentId){

    }

}
