package com.merkury.vulcanus.model.entities.chat;

import com.merkury.vulcanus.model.enums.chat.ChatMessageAttachedFileType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageAttachedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private String name;
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();
    private ChatMessageAttachedFileType chatMessageAttachedFileType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_message_id", nullable = false)
    private ChatMessage chatMessage;

}
