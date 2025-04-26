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

export interface SimpleChatDto {
  id: number;
  name: string;
  imgUrl: string;
  lastMessage: ChatMessageDto;
}

export interface DetailedChatDto {
  id: number;
  name: string;
  imgUrl: string;
  messages: ChatMessageDto[];
  participants: ChatParticipantDto[];
}

export interface ChatPage {
  items: SimpleChatDto[];
  nextPage?: number;
}
