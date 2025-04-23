package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.chat.ChatInvitationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity(name = "chat_invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity sender;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ChatInvitationStatus chatInvitationStatus = ChatInvitationStatus.PENDING;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = LAZY, optional = false)
    private UserEntity receiver;
}
