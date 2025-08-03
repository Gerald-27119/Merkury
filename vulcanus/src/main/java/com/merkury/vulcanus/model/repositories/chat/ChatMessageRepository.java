package com.merkury.vulcanus.model.repositories.chat;

import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Slice<ChatMessage> findAllByChatId(Long chatId, Pageable pageable);
    List<ChatMessage> findTop20ByChatIdOrderBySentAtDesc(Long chatId);
}
