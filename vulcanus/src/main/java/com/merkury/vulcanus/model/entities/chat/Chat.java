package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.chat.ChatType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private String imgUrl;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ChatType chatType = ChatType.PRIVATE;

    @OneToMany(
            mappedBy = "chat",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ChatParticipant> participants = new ArrayList<>();

    public void addParticipant(UserEntity user) {
        var p = ChatParticipant.builder()
                .chat(this)
                .user(user)
                .joinedAt(LocalDateTime.now())
                .build();
        participants.add(p);
    }

    public void removeParticipant(UserEntity user) {
        participants.removeIf(p -> p.getUser().equals(user));
    }

    @Formula(
            "(SELECT MAX(m.sent_at) FROM chat_messages m WHERE m.chat_id = id)"
    )
    private LocalDateTime lastMessageAt;

    @OneToMany(mappedBy = "chat")
    @OrderBy("sentAt DESC")
    private List<ChatMessage> chatMessages;

}
