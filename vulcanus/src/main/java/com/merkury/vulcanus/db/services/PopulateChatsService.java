package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static com.merkury.vulcanus.model.enums.chat.ChatType.GROUP;

@Service
@RequiredArgsConstructor
public class PopulateChatsService {

    private final UserEntityRepository userEntityRepository;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    /**
     * Initializes chat data for development purposes.
     * The primary user that has chats data populated has username "user".
     * <p>
     * The user has:
     * <ul>
     *     <li>30 one-on-one chats (100 messages)</li>
     *     <li>1 three person chat (100 messages)</li>
     *     <li>1 four person chat (100 messages)</li>
     *     <li>1 one-on-one chat (0 messages)</li>
     * </ul>
     * <p>
     * One of the chats will be getting (live) random messages for separate test (dev) service
     *
     * @author Adam Langmesser
     * @Date: 05-07-2025
     */
    @Transactional
    public void initChatsData() {
        // główny użytkownik, mający najwięcej czatów
        UserEntity mainUser = userEntityRepository
                .findByUsername("user")
                .orElseThrow();

        // Inni użytkownicy
        List<UserEntity> others = IntStream.rangeClosed(2, 50)
                .mapToObj(i -> userEntityRepository
                        .findByUsername("user" + i)
                        .orElseThrow()
                )
                .toList();

        // 1) 30 czatów 1‑na‑1 z wiadomościami
        for (int i = 0; i < 30; i++) {
            Chat chat = createChat(List.of(mainUser, others.get(i)), true);
            chatRepository.save(chat);
        }

        // 2) 1 czat 3‑osobowy z wiadomościami
        Chat chat3 = createChat(List.of(mainUser, others.get(30), others.get(31)), true);
        chatRepository.save(chat3);

        // 3) 1 czat 4‑osobowy z wiadomościami
        Chat chat4 = createChat(List.of(mainUser, others.get(32), others.get(33), others.get(34)), true);
        chatRepository.save(chat4);

        // 4) 1 czat 1‑na‑1 bez wiadomości
        Chat chatEmpty = createChat(List.of(mainUser, others.get(35)), false);
        chatRepository.save(chatEmpty);

    }

    private Chat createChat(List<UserEntity> participants, boolean withMessages) {
        Chat chat = Chat.builder().build();

        for (UserEntity u : participants) {
            chat.addParticipant(u);
        }
        if (participants.size() > 2) {
            chat.setChatType(GROUP);
            chat.setName(chat.getParticipants().stream()
                    .map(chatParticipant -> chatParticipant.getUser().getUsername())
                    .collect(Collectors.joining(", ")));
        }

        chat = chatRepository.save(chat); // aby chat miał ID


        if (withMessages) {
            var messages = getRandomChatMessages(sampleChatMessages.length, participants, chat)
                    .toList();

            chatMessageRepository.saveAll(messages);
            chat.getChatMessages().addAll(messages);
            chat.setLastMessageAt(LocalDateTime.now());
            chatRepository.save(chat);
        }

        return chat;
    }

    private Stream<ChatMessage> getRandomChatMessages(int count, List<UserEntity> participants, Chat chat) {
        return IntStream.range(0, count)
                .mapToObj(i -> ChatMessage.builder()
                        .chat(chat)
                        .sender(participants.get(generateRandomNumber(participants.size() - 1)))
                        .content(sampleChatMessages[generateRandomNumber(sampleChatMessages.length - 1)])
                        .sentAt(LocalDateTime.now())
                        .build());
    }


    private int generateRandomNumber(int max) {
        return ThreadLocalRandom.current().nextInt(0, max + 1);
    }

    private final String[] sampleChatMessages = {
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

}
