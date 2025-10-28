export interface ChatMessageDto {
    id: number;
    sender: ChatMessageSenderDto;
    sentAt: string;
    content: string;
    chatId: number;
    attachedFiles: ChatMessageAttachedFileDto[] | null;
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
    // id: number; tak ma byc jakby co :)
    username: string;
    imgUrl: string;
    // isOnline: boolean;
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
    chatType: "PRIVATE" | "GROUP";
}

export interface ChatMessagesPageDto {
    messages: ChatMessageDto[];
    hasNextSlice: boolean;
    numberOfMessages: number;
    sliceNumber: number;
}

export interface ChatMessageAttachedFileDto {
    url: string;
    fileType: string;
    sizeInBytes: number;
    name: string;
}

export interface UpdatedGroupChatDto {
    newName: string;
    newImgUrl: string;
}

export interface UpdatedGroupChat {
    chatId: number;
    newName: string;
    newImgUrl: string;
}

export type PotentialChatMemberDto = {
    username: string;
    profileImg: string | null;
};

export type SimpleSliceDto<T> = {
    hasNext: boolean;
    items: T[];
};

export type AddUsersToExistingGroupChatDto = {
    usernames: string[];
};
