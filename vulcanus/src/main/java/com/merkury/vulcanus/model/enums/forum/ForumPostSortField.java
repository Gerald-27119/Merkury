package com.merkury.vulcanus.model.enums.forum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ForumPostSortField {
    PUBLISH_DATE("publishDate"),
    VIEWS("views"),
    COMMENTS("commentsCount");

    private final String field;
}
