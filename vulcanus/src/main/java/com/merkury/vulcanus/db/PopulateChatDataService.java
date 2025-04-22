package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;

@Service
@RequiredArgsConstructor
public class PopulateChatDataService {

    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public void initChatData() {
        UserEntity chatUser1 = UserEntity.builder()
                .email("chat1@example.com")
                .username("user1")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_USER)
                .provider(Provider.NONE)
                .build();

        UserEntity chatUser2 = UserEntity.builder()
                .email("chat2@example.com")
                .username("user2")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_USER)
                .provider(Provider.NONE)
                .build();
        userEntityRepository.save(chatUser1);
        userEntityRepository.save(chatUser2);
        //TODO:chats and messages for user1
//        at least 15 chats for him, they can be empty, iw ant to have the scroll on
        //fetching other chats, more chats, similar to messages, apgebale?
    }
}
