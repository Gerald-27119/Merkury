package com.merkury.vulcanus.features.vote;

import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentUserVoteInfoDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.SpotCommentVoteType;
import com.merkury.vulcanus.model.interfaces.Votable;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class VoteService {
    private final SpotCommentRepository spotCommentRepository;

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

    public SpotCommentUserVoteInfoDto getVoteInfo(long commentId, String username) {
        var didUpVote = spotCommentRepository.existsByIdAndUpVotedByUsername(commentId, username);
        var didDownVote = !didUpVote && spotCommentRepository.existsByIdAndDownVotedByUsername(commentId, username);

        var voteType = SpotCommentVoteType.NONE;
        if (didUpVote) voteType = SpotCommentVoteType.UP_VOTE;
        else if (didDownVote) voteType = SpotCommentVoteType.DOWN_VOTE;

        return new SpotCommentUserVoteInfoDto(voteType);
    }
}
