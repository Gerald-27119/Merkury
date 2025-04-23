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
        // 1) ensure users exist
        initUsers();

        UserEntity user1 = userEntityRepository
                .findByUsername("user1")
                .orElseThrow();

        // we'll need “others” to fill participant slots
        List<UserEntity> others = IntStream.rangeClosed(2, 30)
                .mapToObj(i -> userEntityRepository
                        .findByUsername("user" + i)
                        .orElseThrow()
                )
                .toList();

        // 2) create & persist, say,  twelve chats
        List<Chat> chats = createChats()  // returns e.g. 12
                .stream()
                .peek(chatRepository::save)
                .toList();

        // 3) assign per-chat rules by index
        for (int i = 0; i < chats.size(); i++) {
            Chat chat = chats.get(i);

            if (i < 3) {
                // FIRST 3 CHATS — no messages, just 2 participants
                initChat(chat,
                        List.of(user1, others.get(i)),
                        /* withMessages= */ false);

            } else if (i < 6) {
                // NEXT 3 CHATS — 3 participants, with messages
                // we take two “others” per chat:
                List<UserEntity> three =
                        List.of(user1,
                                others.get(i),
                                others.get(i + 1));
                initChat(chat, three, /* withMessages= */ true);

            } else {
                // REST — 2 participants, with messages
                initChat(chat,
                        List.of(user1, others.get(i)),
                        /* withMessages= */ true);
            }
        }
    }

    /**
     * Bootstraps a single chat: attaches participants, optionally seeds
     * 50 messages with random 1–3 runs, and saves everything.
     */
    private void initChat(
            Chat chat,
            List<UserEntity> participants,
            boolean withMessages
    ) {
        // attach participants
        for (UserEntity u : participants) {
            chat.addParticipant(u);
        }

        if (withMessages) {
            // generate 50 sample ChatMessage instances
            List<ChatMessage> msgs = getChatMessages().toList();

            // round-robin across participants in runs of 1–3
            int idx = 0, runLen = rndLen(), runCnt = 0;
            for (int i = 0; i < msgs.size(); i++) {
                ChatMessage m = msgs.get(i);
                m.setChat(chat);
                m.setSender(participants.get(idx));
                m.setSentAt(LocalDateTime.now().plusSeconds(i));

                if (++runCnt >= runLen) {
                    idx = (idx + 1) % participants.size();
                    runLen = rndLen();
                    runCnt = 0;
                }
            }

            // bulk-save messages, then wire into chat
            chatMessageRepository.saveAll(msgs);
            chat.getChatMessages().addAll(msgs);
        }

        // finally persist chat + participants (and messages if any)
        chatRepository.save(chat);
    }

    private int rndLen() {
        return ThreadLocalRandom.current().nextInt(1, 4);
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
                "ChatMessage number fifty—mission accomplished!"};
        return IntStream.rangeClosed(1, 50)
                .mapToObj(i -> ChatMessage.builder()
                        .content(samples[(i - 1) % samples.length])
                        .build()
                );
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

}
