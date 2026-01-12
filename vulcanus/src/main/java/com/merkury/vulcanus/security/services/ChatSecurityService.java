package com.merkury.vulcanus.security.services;

import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ChatSecurityService {

    private final ChatRepository chatRepository;
    private final CustomUserDetailsService customUserDetailsService;

    public Boolean isUserAChatMember(Long chatId) {
        return chatRepository.existsByIdAndParticipantsUserUsername(chatId,
                customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername()
        );
    }

}
