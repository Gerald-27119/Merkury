package com.merkury.vulcanus.model.dtos.forum;

import java.util.List;

public record ForumPostCommentReplyPageDto(List<PostCommentGeneralDto> comments,
                                           Long nextCursor) {
}
