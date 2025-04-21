package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class ChatMessage {

    private Long id;
    private Chat chat;
    private String content;
    private UserEntity sender;
    private LocalDateTime sentAt;
    private boolean isSeen;

}
