export interface ChatMessageDto {
    id: number;
    sender: ChatMessageSenderDto;
    sentAt: string;
    content: string;
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
// TODO:delete
export interface SimpleChatDto {
    id: number;
    name: string;
    imgUrl: string;
    lastMessage: ChatMessageDto;
}

// TODO:delete
export interface DetailedChatDto {
    id: number;
    name: string;
    imgUrl: string;
    messages: ChatMessageDto[];
    participants: ChatParticipantDto[];
}

export interface ChatPage {
    items: ChatDto[];
    nextPage?: number;
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
