package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
@Data
public class Chat {

    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private Set<UserEntity> participants;
    private Set<ChatMessage> messages; //TODO: Set vs List?
}
