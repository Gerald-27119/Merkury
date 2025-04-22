package com.merkury.vulcanus.model.repositories.chat;

import com.merkury.vulcanus.model.entities.chat.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
}
