package com.merkury.vulcanus.features.vote;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.Votable;
import org.springframework.stereotype.Service;

@Service
public class VoteService {

    public void vote(Votable votable, UserEntity user, boolean isUpvote) {
        var voteList = isUpvote ? votable.getUpvotedBy() : votable.getDownvotedBy();
        var oppositeVoteList = isUpvote ? votable.getDownvotedBy() : votable.getUpvotedBy();

        if (voteList.contains(user)) {
            voteList.remove(user);
        } else {
            oppositeVoteList.remove(user);
            voteList.add(user);
        }

        votable.setUpvotes(votable.getUpvotedBy().size());
        votable.setDownvotes(votable.getDownvotedBy().size());
    }
}
