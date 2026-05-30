export interface User {
  username: string;
  password: string;
  displayName: string;
  avatar: string;
  contact: string;
  contactType: "tg" | "vk" | "other";
  description: string;
  isAdmin: boolean;
  isBanned: boolean;
  joinedAt: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "key" | "account" | "item" | "game" | "currency";
  game: string;
  seller: string;
  sellerVerified: boolean;
  image: string;
  images: string[];
  videoUrl: string;
  isFavorite?: boolean;
  views: number;
  createdAt: string;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  isOwn: boolean;
}

export interface Chat {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  product?: string;
}