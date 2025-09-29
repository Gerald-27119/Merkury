package com.merkury.vulcanus.exception.exceptions;

public class ChatNotFoundException extends Exception {
    public ChatNotFoundException(String message) {
        super(message);
    }

    public ChatNotFoundException(Long chatId) {
        super("Chat with id: [" + chatId + "] not found");
    }
}
