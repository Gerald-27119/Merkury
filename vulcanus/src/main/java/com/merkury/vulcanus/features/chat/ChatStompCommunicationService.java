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

//    TODO: why that helps with?:
//    025-05-17T16:53:03.393+02:00  INFO 11028 --- [vulcanus] [nboundChannel-4] m.v.c.c.ChatStompCommunicationController : Received message for chat: 1, message: ChatMessageDto[id=null, sender=ChatMessageSenderDto[id=1, name=null, imgUrl=null], sentAt=null, content=adam, chatId=1]
//    Hibernate: select c1_0.id,c1_0.chat_type,c1_0.created_at,c1_0.img_url,(SELECT MAX(m.sent_at) FROM chat_messages m WHERE m.chat_id = c1_0.id),c1_0.name from chats c1_0 where c1_0.id=?
//            2025-05-17T16:53:03.406+02:00 DEBUG 11028 --- [vulcanus] [nboundChannel-4] .WebSocketAnnotationMethodMessageHandler : Searching methods to handle LazyInitializationException
//2025-05-17T16:53:03.407+02:00 ERROR 11028 --- [vulcanus] [nboundChannel-4] .WebSocketAnnotationMethodMessageHandler : Unhandled exception from message handler method
//
//    org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role: com.merkury.vulcanus.model.entities.chat.Chat.chatMessages: could not initialize proxy - no Session
//
//     //Po co transactional?
//    @Transactional
//    public ChatMessageDto saveMessage(ChatMessageDto message) {
////        TODO:no check if chat exists
//        var chat = chatRepository.findById(message.chatId()).get(); //TODO: get reference by id vs findById
//        var chatMessage = ChatMessage.builder()
//                .content(message.content())
//                .sender(userEntityRepository.getReferenceById(message.sender().id()))
//                .chat(chat)
//                .build();
//
//        chat.getChatMessages().add(chatMessage);
////        chatRepository.save(chat); TODO: czemu to jest zbędne?
//
//        var messageId = chatMessageRepository.save(chatMessage).getId();
//
//        return message.toBuilder()
//                .id(messageId)
//                .build();
//    }

}
