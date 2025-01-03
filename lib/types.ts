export interface Message {
  role: 'user' | 'assistant';
  content: string;
  messageId: string;
  chatId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences?: {
    interests: string[];
    priceRange: string;
    shoppingFrequency: string;
    preferredCategories: string[];
    notificationPreferences: string[];
  };
}
