package com.merkury.vulcanus.model.repositories.chat;

import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Optional<ChatMessage> findTopByChatOrderBySentAtDesc(Chat chat);
    Optional<List<ChatMessage>> findALlByChatOrderBySentAtDesc(Chat chat);

//    1. Page<ChatMessage> findByChatOrderBySentAtDesc(Chat chat, Pageable pageable);
//    If you want just “is there another page?” (no count):
//
//    2. Slice<ChatMessage> findByChatOrderBySentAtDesc(Chat chat, Pageable pageable);
//    For very large chats/infinite scroll deep dive:
//
//    3.List<ChatMessage> findByChatAndSentAtBeforeOrderBySentAtDesc(
//            Chat chat, Instant beforeSentAt, Pageable pageable);
//
//    4.Or use Spring Data’s Scroll API (Spring Data JPA 3.5+).

}
