package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.exception.exceptions.AddUsersToExistingGroupChatException;
import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.ChatNotFoundException;
import com.merkury.vulcanus.exception.exceptions.CreateGroupChatException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.UserByUsernameNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import com.merkury.vulcanus.model.dtos.chat.group.AddUsersToExistingGroupChatDto;
import com.merkury.vulcanus.model.dtos.chat.group.CreateGroupChatDto;
import com.merkury.vulcanus.model.dtos.chat.group.UpdateGroupChatDto;
import com.merkury.vulcanus.model.dtos.chat.group.UpdatedGroupChatDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    // TODO: przy edycji chatu sprawdzenie czy user ma odmina an tym czacie

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ChatMessageDtoSlice> getMessagesForChatByChatId(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "1") int pageParam, // 1 because first page of 20 is returned in first request to "/user-chats"
            @RequestParam(defaultValue = "20") int numberOfMessagesPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId, pageParam, numberOfMessagesPerPage));
    }

    @GetMapping("/user-chats")
    public ResponseEntity<List<ChatDto>> getChatsForUserWithLast20Messages(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int numberOfChatsPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatsForUserWithLast20Messages(pageNumber, numberOfChatsPerPage));
    }

    @PostMapping("/get-or-create-private-chat")
    public ResponseEntity<ChatDto> getOrCreatePrivateChat(
            @RequestParam String receiverUsername,
            @RequestParam(required = false) Long chatId
    ) throws UserNotFoundException {
        return ResponseEntity.ok(chatService.getOrCreatePrivateChat(chatId, receiverUsername));
    }

    @PostMapping(
            path = "/{chatId}/send-files",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> sendFiles(
            @PathVariable Long chatId,
            @RequestParam("media") List<MultipartFile> media
    ) throws ChatNotFoundException, InvalidFileTypeException, UserByUsernameNotFoundException, BlobContainerNotFoundException, IOException {
        chatService.organizeFilesSend(media, chatId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
//    TODO; prywatyzacja przesłanych zdjęc, tak aby tylko uczestnicy chatu mieli do nich dostęp, obecnie ma każdy kto ma link do zdjęcia

    @PostMapping("create/group")
    public ResponseEntity<ChatDto> createGroupChat(@RequestBody CreateGroupChatDto createGroupChatDto) throws CreateGroupChatException {
        var chatDto = chatService.createGroupChat(createGroupChatDto);
        return new ResponseEntity<>(chatDto, HttpStatus.CREATED);
    }

    //    TODO: maybe implement in future, maybe not?
    @PutMapping("add/users")
    public ResponseEntity<ChatDto> addUsersToGroupChat(@RequestBody AddUsersToExistingGroupChatDto addUsersToExistingGroupChatDto) throws ChatNotFoundException, AddUsersToExistingGroupChatException {
        var chatDto = chatService.addUsersToGroupChat(
                addUsersToExistingGroupChatDto.usernames(),
                addUsersToExistingGroupChatDto.currentUserUsername(),
                addUsersToExistingGroupChatDto.chatId()
        );
        return new ResponseEntity<>(chatDto, HttpStatus.OK);
    }

    @PatchMapping(
            value = "/{chatId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UpdatedGroupChatDto> updateGroupChat(
            @PathVariable Long chatId,
            @ModelAttribute UpdateGroupChatDto updateGroupChatDto
    ) throws ChatNotFoundException, InvalidFileTypeException, BlobContainerNotFoundException, IOException {
        UpdatedGroupChatDto updated = this.chatService.updateGroupChat(chatId, updateGroupChatDto);
        return ResponseEntity.ok(updated);
    }


//    @GetMapping("/group-chat/add/{chatId}")
//    public ResponseEntity<SocialPageDto> searchPotentialUsersToAddToGroupChatByUsername(@PathVariable Long chatId,
//                                                               @RequestParam(defaultValue = "0") int page,
//                                                               @RequestParam(defaultValue = "20") int size) throws UserNotFoundByUsernameException {
////        return ResponseEntity.ok(userDashboardService.searchUsersByUsername(query, page, size));
//    }
}
