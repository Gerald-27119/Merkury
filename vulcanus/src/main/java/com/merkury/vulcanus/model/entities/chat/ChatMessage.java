package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
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

//    @Column(nullable = false)
    private String content;

//    @Column(nullable = false)
    private LocalDateTime sentAt;

//    @Column(nullable = false)
    @Builder.Default
    private boolean isSeen = false;
}
