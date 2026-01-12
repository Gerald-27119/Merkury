package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.chat.ChatType;

public class ChatAlreadyExistsException extends Exception {
    public ChatAlreadyExistsException(ChatType chatType, String username1, String username2, Long chatId) {
        super("Chat of ChatType [" + chatType + "], between users [" + username1 + "] and [" + username2 + "] already exists with id [" + chatId + "]");
    }
}
