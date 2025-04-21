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
  img: string;
  lastMessage: ListedChatLastedMessage;
}

export interface DetailedChat {
  id: number;
  name: string;
  img: string;
  messages: Message[];
  participants: Participant[];
}

export interface Message {
  id: number;
  content: string;
  sentAt: string;
  sender: MessageSender;
}

export const MockSenders: MessageSender[] = [
  { id: 1, name: "Ania", img: "" },
  { id: 2, name: "Bartek", img: "" },
  { id: 3, name: "Cezary", img: "" },
  { id: 4, name: "Dominika", img: "" },
  { id: 5, name: "Ewa", img: "" },
  { id: 6, name: "Filip", img: "" },
  { id: 7, name: "Grażyna", img: "" },
  { id: 8, name: "Hubert", img: "" },
  { id: 9, name: "Iwona", img: "" },
  { id: 10, name: "Jacek", img: "" },
  { id: 11, name: "Kamil", img: "" },
  { id: 12, name: "Lena", img: "" },
  { id: 13, name: "Marek", img: "" },
  { id: 14, name: "Natalia", img: "" },
  { id: 15, name: "Olga", img: "" },
  { id: 16, name: "Paweł", img: "" },
  { id: 17, name: "Roksana", img: "" },
  { id: 18, name: "Szymon", img: "" },
  { id: 19, name: "Teresa", img: "" },
  { id: 20, name: "Wojciech", img: "" },
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
function makeMessages(chatId: number, participants: Participant[]): Message[] {
  const messages: Message[] = [];
  for (let i = 1; i <= 50; i++) {
    const sender =
      participants[Math.floor(Math.random() * participants.length)];
    const msg: Message = {
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
