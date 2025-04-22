package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserEntityRepository userEntityRepository;

    public List<SimpleChatDto> getSimpleChatsForUserId(Long userId) {
//        var userChats = userEntityRepository.findById(userId).orElseThrow().getChats();
//        var chats
        return null;
    }
}
