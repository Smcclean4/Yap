import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserInfoInterface } from '~/pages/friends';
import { useSession } from 'next-auth/react';
import { socket } from '~/pages/api/socket-client';

interface ChatContextType {
  sideBarChats: UserInfoInterface[];
  conversationChat: any[];
  onlineUserIds: string[];
  addChat: (chat: UserInfoInterface) => void;
  removeChat: (chatName: string) => void;
  addMessage: (message: string) => void;
  clearConversation: () => void;
  setConversationChat: (messages: any[]) => void;
  isUserOnline: (userId?: string | null) => boolean;
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
  const { data: session } = useSession();

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
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);



  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sideBarChatData', JSON.stringify(sideBarChats));
      localStorage.setItem('conversationChatData', JSON.stringify(conversationChat));
    }
  }, [sideBarChats, conversationChat]);

  // Global socket presence (single connection for the app)
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    socket.connect();
    socket.emit("presence:join", { userId });

    const onPresenceState = (payload: { onlineUserIds?: string[] }) => {
      setOnlineUserIds(Array.isArray(payload?.onlineUserIds) ? payload.onlineUserIds : []);
    };

    socket.on("presence:state", onPresenceState);

    // Listen for sidebar updates when receiving a new message
    const onSidebarUpdate = (payload: { 
      toUserId: string; 
      senderId: string; 
      senderName: string; 
      senderImage: string; 
      senderHeading: string; 
      message: string; 
    }) => {
      console.log("sidebar:update received", payload);
      
      // Only update if this message is for the current user (they are the recipient)
      if (payload.toUserId === userId && payload.senderId !== userId) {
        // Create the chat user object for the sender (who sent the message)
        const chatUser: UserInfoInterface = {
          id: payload.senderId, // This will be used for matching, but friendId is what we need
          friendId: payload.senderId, // The actual user ID of the sender
          name: payload.senderName,
          image: payload.senderImage || '',
          heading: payload.senderHeading || '',
          online: false, // Will be updated by presence system
        };

        // Add to sidebar if it doesn't already exist
        setSideBarChats(prev => {
          const exists = prev.some(existingChat => 
            existingChat.friendId === chatUser.friendId || existingChat.id === chatUser.friendId
          );
          if (!exists) {
            return [...prev, chatUser];
          }
          return prev;
        });
      }
    };

    socket.on("sidebar:update", onSidebarUpdate);

    return () => {
      socket.off("presence:state", onPresenceState);
      socket.off("sidebar:update", onSidebarUpdate);
      // Intentionally keep the connection alive across route changes.
      // The disconnect will happen on full page unload.
    };
  }, [session?.user?.id]);

  const onlineSet = useMemo(() => new Set(onlineUserIds), [onlineUserIds]);
  const isUserOnline = (userId?: string | null) => {
    if (!userId) return false;
    return onlineSet.has(userId);
  };

  const addChat = (chat: UserInfoInterface) => {
    setSideBarChats(prev => {
      const exists = prev.some(existingChat => existingChat.friendId === chat.friendId);
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
    onlineUserIds,
    addChat,
    removeChat,
    addMessage,
    clearConversation,
    setConversationChat,
    isUserOnline,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
