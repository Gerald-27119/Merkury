package com.merkury.vulcanus.model.repositories.chat;

import com.merkury.vulcanus.model.entities.chat.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    Page<Chat> findAllByParticipantsUserUsername(String username, Pageable pageable);

}
