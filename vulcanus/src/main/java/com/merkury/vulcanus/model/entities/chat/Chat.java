package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Builder
@Data
public class Chat {

    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private String imgUrl;
    private Set<UserEntity> participants;
    private Set<ChatMessage> messages; //TODO: Set vs List?

    @ManyToMany
    private List<ChatInvitation> invitations;

    @OneToMany(mappedBy = "chat")//?
    private List<ChatMessage> chatMessages;

}
