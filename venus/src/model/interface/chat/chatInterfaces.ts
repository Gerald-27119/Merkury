export interface ChatMessageDto {
    id: number;
    sender: ChatMessageSenderDto;
    sentAt: string;
    content: string;
    chatId: number;
}

export interface ChatMessageToReceiveDto {
    id: number;
    senderId: number;
    sentAt: string;
    content: string;
    chatId: number;
}

export interface ChatMessageToSendDto {
    sentAt: string;
    content: string;
    chatId: number;
    optimisticMessageUUID: string; // NOWE
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
    nextPage?: number; //TODO:moze byc null?
}

/**
 * This interface is used to represent a chat with all its details, including messages and participants.
 * @author Adam Langmesser
 */
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

export type ChatMessageLocal = ChatMessageDto & {
    optimistic?: true;
    optimisticUUID?: string; // korelacja z ACK
};

export interface ChatMessageAckDto {
    chatMessageDto: ChatMessageDto; // finalny obiekt z DB
    optimisticMessageUUID: string; // to co wysłałeś w payloadzie
}
