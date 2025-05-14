package com.merkury.vulcanus.features.vote;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.Votable;
import org.springframework.stereotype.Service;

@Service
public class VoteService {

    public void vote(Votable votable, UserEntity user, boolean isUpVote) {
        var voteList = isUpVote ? votable.getUpVotedBy() : votable.getDownVotedBy();
        var oppositeVoteList = isUpVote ? votable.getDownVotedBy() : votable.getUpVotedBy();

        if (voteList.contains(user)) {
            voteList.remove(user);
        } else {
            oppositeVoteList.remove(user);
            voteList.add(user);
        }

        votable.setUpVotes(votable.getUpVotedBy().size());
        votable.setDownVotes(votable.getDownVotedBy().size());
    }
}
