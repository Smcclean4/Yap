import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfoInterface } from '~/pages/friends';

interface ChatContextType {
  sideBarChats: UserInfoInterface[];
  conversationChat: any[];
  addChat: (chat: UserInfoInterface) => void;
  removeChat: (chatName: string) => void;
  addMessage: (message: string) => void;
  clearConversation: () => void;
  setConversationChat: (messages: any[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  
  // Initialize state from localStorage immediately
  const getInitialSideBarChats = (): UserInfoInterface[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sideBarChatData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing sideBarChatData:', e);
          return [];
        }
      }
    }
    return [];
  };

  const getInitialConversationChat = (): any[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conversationChatData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing conversationChatData:', e);
          return [];
        }
      }
    }
    return [];
  };

  const [sideBarChats, setSideBarChats] = useState<UserInfoInterface[]>(getInitialSideBarChats);
  const [conversationChat, setConversationChat] = useState<any[]>(getInitialConversationChat);



  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sideBarChatData', JSON.stringify(sideBarChats));
      localStorage.setItem('conversationChatData', JSON.stringify(conversationChat));
    }
  }, [sideBarChats, conversationChat]);

  const addChat = (chat: UserInfoInterface) => {
    setSideBarChats(prev => {
      const exists = prev.some(existingChat => existingChat.name === chat.name);
      if (!exists) {
        return [...prev, chat];
      }
      return prev;
    });
  };

  const removeChat = (chatName: string) => {
    setSideBarChats(prev => prev.filter(chat => chat.name !== chatName));
  };

  const addMessage = (message: string) => {
    setConversationChat(prev => [...prev, message]);
  };

  const clearConversation = () => {
    setConversationChat([]);
  };

  const value: ChatContextType = {
    sideBarChats,
    conversationChat,
    addChat,
    removeChat,
    addMessage,
    clearConversation,
    setConversationChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
