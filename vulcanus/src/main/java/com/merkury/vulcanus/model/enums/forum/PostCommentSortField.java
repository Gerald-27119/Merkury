package com.merkury.vulcanus.model.enums.forum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostCommentSortField {
    PUBLISH_DATE("publishDate"),
    UP_VOTES("upVotes"),
    DOWN_VOTES("downVotes");

    private final String field;
}
