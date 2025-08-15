export interface ChatMessageDto {
    id: number;
    sender: ChatMessageSenderDto;
    sentAt: string;
    content: string;
    chatId: number;
}

export interface ChatMessageToSendDto {
    sentAt: string;
    content: string;
    chatId: number;
    optimisticMessageUUID: string;
}

export interface ChatMessageSenderDto {
    id: number;
    name: string;
    imgUrl: string;
}

export interface ChatParticipantDto {
    id: number;
    name: string;
    imgUrl: string;
    isOnline: boolean;
}

export interface ChatPage {
    items: ChatDto[];
    nextPage?: number;
}

export interface ChatDto {
    id: number;
    name: string;
    imgUrl: string;
    messages: ChatMessageDto[];
    participants: ChatParticipantDto[];
    lastMessage: ChatMessageDto;
}

export interface ChatMessagesPageDto {
    messages: ChatMessageDto[];
    hasNextSlice: boolean;
    numberOfMessages: number;
    sliceNumber: number;
}
