package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PopulateChatsService {

    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public void initUsers() {
        var users = generateUsers();
        userEntityRepository.saveAll(users);
    }

    private List<UserEntity> generateUsers() {
        return IntStream.rangeClosed(1, 30)
                .mapToObj(i -> UserEntity.builder()
                        .email(String.format("user%d@example.com", i))
                        .username("user" + i)
                        .password(passwordEncoder.encode("password"))
                        .build()
                )
                .collect(Collectors.toList());
    }


    @Transactional
    public void initChatData() {
        initUsers();

        // 1) load your users
        UserEntity user1 = userEntityRepository.findByUsername("user1").orElseThrow();
        UserEntity user2 = userEntityRepository.findByUsername("user2").orElseThrow();

        // 2) create or load chats (make sure createChats() already persisted them,
        //    otherwise you'll need to save here)
        Chat chat1 = createChats().getFirst();

        // 3) prepare your message stream
        List<ChatMessage> chat1Messages = getChatMessages().toList();

        // 4) assign chat, sender and sentAt with random 1–3 runs
        UserEntity currentSender = user1;
        int runLength = ThreadLocalRandom.current().nextInt(1, 4), runCount = 0;
        for (int i = 0; i < chat1Messages.size(); i++) {
            ChatMessage msg = chat1Messages.get(i);
            msg.setChat(chat1);
            msg.setSender(currentSender);
            msg.setSentAt(LocalDateTime.now().plusSeconds(i));

            if (++runCount >= runLength) {
                currentSender = currentSender.equals(user1) ? user2 : user1;
                runLength = ThreadLocalRandom.current().nextInt(1, 4);
                runCount = 0;
            }
        }

        chatMessageRepository.saveAll(chat1Messages);
        // 5) attach messages and participants to the chat
        chat1.getChatMessages().addAll(chat1Messages);
        chat1.addParticipant(user1);
        chat1.addParticipant(user2);

        // 6) save once—cascade will persist messages & participants
        chatRepository.save(chat1);
    }

    private List<Chat> createChats() {
        var chats = IntStream.range(0, 20)
                .mapToObj(i -> createChat())
                .toList();

        return chatRepository.saveAll(chats);
    }

    private Chat createChat() {
        return Chat.builder()
                .build();
    }

    private Stream<ChatMessage> getChatMessages() {
        String[] samples = {
                "Hi!",
                "How are you doing today?",
                "This is a slightly longer message to show variability.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Short.",
                "Here’s a medium-length one to mix things up.",
                "A very, very, very, very, very, very long message that just keeps going and going to simulate a verbose user.",
                "Ok.",
                "What’s the plan for the weekend?",
                "😂👍",
                "Did you catch the game last night? It was incredible from start to finish!",
                "Ping!",
                "Yes.",
                "No.",
                "Maybe later.",
                "I’ll get back to you on that.",
                "Sure thing.",
                "Thanks!",
                "You’re welcome.",
                "See you soon.",
                "Goodbye!",
                "That sounds great.",
                "Can you elaborate on that point a bit more?",
                "Absolutely—here are the details you asked for: 1) First item; 2) Second item; 3) Third item.",
                "🤔",
                "Let me think about it.",
                "I'll send the document over in a moment.",
                "Check this out!",
                "🚀🎉",
                "Remember to submit your timesheet by EOD.",
                "Happy birthday!!! 🎂🥳",
                "Reminder: team sync at 3pm.",
                "Sure, what time works for you?",
                "I’m free all afternoon.",
                "Let’s do lunch tomorrow.",
                "Sounds good.",
                "👍",
                "👀",
                "🔔",
                "Here’s the link: https://example.com",
                "This one’s just long enough to be interesting without being overwhelming.",
                "Tiny.",
                "Mid-sized message, right?",
                "This is another example of a longer piece of text meant to simulate a user typing several sentences in one go for testing.",
                "End.",
                "🐱‍🏍",
                "🎶🎵",
                "ChatMessage number fifty—mission accomplished!"
        };

        return IntStream.rangeClosed(1, 50)
                .mapToObj(i -> ChatMessage.builder()
                        .content(samples[(i - 1) % samples.length])
                        .build()
                );
    }

}
