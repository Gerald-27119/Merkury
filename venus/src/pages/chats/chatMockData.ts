export interface ListedChatLastedMessage {
  id: number;
  message: string;
  sentAt: string;
  sender: string;
}

export interface MessageSender {
  id: number;
  name: string;
  img: string;
}

export interface Participant {
  id: number;
  name: string;
  img: string;
  isOnline: boolean;
}

export interface ListedChatDto {
  id: number;
  name: string;
  imgUrl: string;
  lastMessageDto: ListedChatLastedMessage;
}

export interface DetailedChat {
  id: number;
  name: string;
  img: string;
  messages: SimpleMessageDto[];
  participants: Participant[];
}

export interface SimpleMessageDto {
  id: number;
  content: string;
  sentAt: string;
  sender: MessageSender;
}

export const MockSenders: MessageSender[] = [
  { id: 1, name: "Ania", img: "/public/logo.png" },
  { id: 2, name: "Bartek", img: "/public/logo.png" },
  { id: 3, name: "Cezary", img: "/public/logo.png" },
  { id: 4, name: "Dominika", img: "/public/logo.png" },
  { id: 5, name: "Ewa", img: "/public/logo.png" },
  { id: 6, name: "Filip", img: "/public/logo.png" },
  { id: 7, name: "Grażyna", img: "/public/logo.png" },
  { id: 8, name: "Hubert", img: "/public/logo.png" },
  { id: 9, name: "Iwona", img: "/public/logo.png" },
  { id: 10, name: "Jacek", img: "/public/logo.png" },
  { id: 11, name: "Kamil", img: "/public/logo.png" },
  { id: 12, name: "Lena", img: "/public/logo.png" },
  { id: 13, name: "Marek", img: "/public/logo.png" },
  { id: 14, name: "Natalia", img: "/public/logo.png" },
  { id: 15, name: "Olga", img: "/public/logo.png" },
  { id: 16, name: "Paweł", img: "/public/logo.png" },
  { id: 17, name: "Roksana", img: "/public/logo.png" },
  { id: 18, name: "Szymon", img: "/public/logo.png" },
  { id: 19, name: "Teresa", img: "/public/logo.png" },
  { id: 20, name: "Wojciech", img: "/public/logo.png" },
];

function getRandomElements<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (result.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// Generate participants for a chat
function makeParticipants(count: number): Participant[] {
  return getRandomElements(MockSenders, count).map((s) => ({
    id: s.id,
    name: s.name,
    img: s.img,
    isOnline: Math.random() < 0.5,
  }));
}

// Generate 50 messages for given participants
function makeMessages(
  chatId: number,
  participants: Participant[],
): SimpleMessageDto[] {
  const messages: SimpleMessageDto[] = [];
  for (let i = 1; i <= 50; i++) {
    const sender =
      participants[Math.floor(Math.random() * participants.length)];
    const msg: SimpleMessageDto = {
      id: chatId * 1000 + i,
      content: `Sample message ${i} in chat ${chatId}`,
      sentAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24),
      ).toISOString(),
      sender: { id: sender.id, name: sender.name, img: sender.img },
    };
    messages.push(msg);
  }
  return messages;
}

export const MockChatListData: ListedChatDto[] = [];
export const DetailedChats: DetailedChat[] = [];

for (let chatId = 1; chatId <= 15; chatId++) {
  const isGroup = chatId <= 5;
  const participantCount = isGroup ? (chatId === 1 ? 2 : 3) : 2;
  const participants = makeParticipants(participantCount);
  const messages = makeMessages(chatId, participants);
  const last = messages[messages.length - 1];
  const lastMessage: ListedChatLastedMessage = {
    id: last.id,
    message: last.content,
    sentAt: last.sentAt,
    sender: last.sender.name,
  };
  const name = isGroup ? `Group Chat ${chatId}` : `Private Chat ${chatId - 5}`;

  MockChatListData.push({
    id: chatId,
    name,
    img: "/public/logo.png",
    lastMessage,
  });

  DetailedChats.push({
    id: chatId,
    name,
    img: "/public/logo.png",
    participants,
    messages,
  });
}
