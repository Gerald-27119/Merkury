package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.enums.chat.ChatParticipantRole;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_participants",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_chat_participant_chat_user",
                columnNames = {"chat_id", "user_id"}
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime lastInteractionAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ChatParticipantRole role = ChatParticipantRole.MEMBER;
}
