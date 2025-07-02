package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_messages",
//        https://www.baeldung.com/jpa-indexes
        indexes = {//TODO: test if works,
                @Index(name = "index_chat_message_sent_at", columnList = "chat_id, sent_at")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity sender;
//TODO: figure out better defaults
//    @Column(nullable = false)
    @Builder.Default
    private String content = "";

//    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();

//    @Column(nullable = false)
    @Builder.Default
    private boolean isSeen = false;
}
