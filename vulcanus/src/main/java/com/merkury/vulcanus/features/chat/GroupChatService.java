package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.dtos.chat.group.CreateGroupChatDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.enums.chat.ChatType;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public Chat create(CreateGroupChatDto createGroupChatDto) throws Exception {
        var usernames = createGroupChatDto.usernames();
        var ownerUsername = createGroupChatDto.ownerUsername();

        var owner = userEntityRepository.findByUsername(ownerUsername).orElseThrow(() -> new UsernameNotFoundException(ownerUsername));
        var participants = this.getParticipants(usernames);


        var chat = Chat.builder()
                .chatType(ChatType.GROUP)
                .name(this.provideDefaultChatName(usernames, ownerUsername))
                .build();

        chat.addOwner(owner);
        chat.addParticipants(participants);
        return chatRepository.save(chat);
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

    private List<UserEntity> getParticipants(List<String> usernames) throws Exception {
        var participants = userEntityRepository.findAllByUsernameIn(usernames);
        if (participants.isEmpty()) throw new Exception();// TODO: custome excpetion
        else return participants;
    }

}
