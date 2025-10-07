package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.dtos.chat.group.CreateChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.enums.chat.ChatType;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
class GroupChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserEntityRepository userEntityRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final AzureBlobService azureBlobService;
    private final ChatStompCommunicationService chatStompCommunicationService;

    public void create(CreateChatDto createChatDto) {
        var usernames = createChatDto.usernames();
        var ownerUsername = createChatDto.ownerUsername();
        usernames.add(ownerUsername);

        var participants = userEntityRepository.findAllByUsernameIn(usernames);

        var chat = Chat.builder()
                .chatType(ChatType.GROUP)
                .name(this.provideDefaultChatName(usernames, ownerUsername))
                .build();
        chat.addParticipants(participants);//owner, admini...., kto zsotaje ownerem jaks tary owner wyjdzie?

    }

    private String provideDefaultChatName(List<String> usernames, String ownerUsername) {
        Stream<String> owner = ownerUsername == null ? Stream.empty() : Stream.of(ownerUsername);
        Stream<String> others = usernames == null ? Stream.empty() : usernames.stream();

        return Stream.concat(owner, others)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.joining(", "));
    }

}
