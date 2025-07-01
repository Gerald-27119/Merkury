package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatStompCommunicationService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserEntityRepository userEntityRepository;
    private final ChatRepository chatRepository;

    //TODO: move logic here
}
