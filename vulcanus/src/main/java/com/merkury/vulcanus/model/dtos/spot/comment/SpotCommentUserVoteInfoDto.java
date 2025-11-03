package com.merkury.vulcanus.model.dtos.spot.comment;

import com.merkury.vulcanus.model.enums.SpotCommentVoteType;

public record SpotCommentUserVoteInfoDto(
        SpotCommentVoteType voteInfo
) {
}
