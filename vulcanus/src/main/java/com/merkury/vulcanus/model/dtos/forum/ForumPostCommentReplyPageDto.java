package com.merkury.vulcanus.model.dtos.forum;

import java.time.LocalDateTime;
import java.util.List;

public record ForumPostCommentReplyPageDto(List<PostCommentGeneralDto> comments,
                                           Long nextCursorId,
                                           LocalDateTime nextCursorDate) {
}
