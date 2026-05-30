import { User, Product, Chat } from "../types";

export const MOCK_USERS: User[] = [
  {
    username: "ADMINISTRATOR",
    password: "CONSOLE",
    displayName: "ADMINISTRATOR",
    avatar: "",
    contact: "@admin",
    contactType: "tg",
    description: "Системный администратор JJRKDOEM`HUB QQ",
    isAdmin: true,
    isBanned: false,
    joinedAt: "2024-01-01",
    verified: true,
  },
  {
    username: "CyberTrader_X",
    password: "pass123",
    displayName: "CyberTrader X",
    avatar: "",
    contact: "@cybertrader",
    contactType: "tg",
    description: "Продаю ключи и аккаунты. Быстро, надёжно. Пишите в TG: @cybertrader",
    isAdmin: false,
    isBanned: false,
    joinedAt: "2024-03-15",
    verified: true,
  },
  {
    username: "NeonDealer",
    password: "neon777",
    displayName: "NeonDealer",
    avatar: "",
    contact: "@neondealer",
    contactType: "tg",
    description: "Торгую предметами CS2 и Dota 2. Контакт: @neondealer",
    isAdmin: false,
    isBanned: false,
    joinedAt: "2024-05-20",
    verified: false,
  },
];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    username: "CyberTrader_X",
    avatar: "",
    lastMessage: "Готов к сделке, пишите детали",
    time: "14:32",
    unread: 2,
    product: "AK-47 | Redline FT — CS2",
  },
  {
    id: "2",
    username: "NeonDealer",
    avatar: "",
    lastMessage: "Аккаунт ещё доступен",
    time: "Вчера",
    unread: 0,
    product: "Valorant Silver 2",
  },
];