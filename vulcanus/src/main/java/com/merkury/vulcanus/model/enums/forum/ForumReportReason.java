package com.merkury.vulcanus.model.enums.forum;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ForumReportReason {
    @JsonProperty("Inappropriate content")
    INAPPROPRIATE_CONTENT,
    @JsonProperty("Offensive content")
    OFFENSIVE_CONTENT,
    @JsonProperty("Spam")
    SPAM
}
