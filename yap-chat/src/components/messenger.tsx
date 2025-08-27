import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { UserInfoInterface } from '~/pages/friends';
import { MessageModal } from '~/modals/message';
import { useSession } from 'next-auth/react'
import { useModal } from '~/hooks/useModal';
import { Toaster, toast } from 'react-hot-toast';
import { socket } from '~/pages/api/socket-client';
import { api } from '~/utils/api';
import { LoadingPage } from '~/shared/loading';
import { useChatContext } from '~/contexts/ChatContext';

interface MessengerInterface {
  messengeruser?: UserInfoInterface;
  trigger?: boolean;
}

export const ChatMessenger = ({ messengeruser, trigger }: MessengerInterface) => {
  const [userMessage, setUserMessage] = useState('')
  const [currentMessengerUser, setCurrentMessengerUser] = useState<UserInfoInterface | null>(null)
  
  const { isShowing, toggle } = useModal();
  const initialRender = useRef(true);
  
  // Use global chat context instead of local state
  const { 
    sideBarChats, 
    conversationChat, 
    addChat, 
    removeChat, 
    addMessage, 
    clearConversation, 
    setConversationChat 
  } = useChatContext();

  const { data: session } = useSession();
  const ctx = api.useContext();

  const currentUserId = session?.user.id;
  const currentMessengerName = currentMessengerUser?.name || messengeruser?.name;

  const { data: displayAllMessages, isLoading: loadingMessages } = api.messenger.getChatMessages.useQuery(
    { threadId: currentUserId || '', sender: currentMessengerName || '' },
    { 
      enabled: Boolean(currentUserId && currentMessengerName && currentMessengerName.trim() !== ''),
      retry: 3,
      retryDelay: 1000
    }
  )

  const { mutate: createMessageThread, isLoading: loadingThreadCreation } = api.messenger.createThread.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const { mutate: sendPrivateMessage, isLoading: loadingMessageSend } = api.messenger.postMessage.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const { mutate: deleteThread, isLoading: loadingThreadDeletion } = api.messenger.deleteThread.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const itemExists = useCallback((name: string | undefined, item: { name: any; }[]) => {
    return item.some((chat: { name: any; }) => {
      return chat?.name === name
    })
  }, [])

  const updateMessenger = useCallback(() => {
    // Only add to chats if we have a messengeruser AND the trigger is true (meaning message was clicked)
    if (messengeruser && trigger && !itemExists(messengeruser.name, sideBarChats)) {
      addChat(messengeruser)
    }
  }, [messengeruser, trigger, itemExists, sideBarChats, addChat])

  const triggerMessage = useCallback(() => {
    if (!currentUserId || !currentMessengerName) {
      console.log("either current user id or current messenger name does not exist")
      return
    };
    createMessageThread({ referenceId: currentUserId, userToSendMessage: currentMessengerName })
    console.log(displayAllMessages)
    toggle()
  }, [currentUserId, currentMessengerName])

  // Only update messenger if we have a messengeruser
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else if (trigger && messengeruser) {
      setCurrentMessengerUser(messengeruser)
      triggerMessage()
    }
    if (messengeruser) {
      updateMessenger()
    }
  }, [trigger, messengeruser, updateMessenger, triggerMessage])

  const closeChat = () => {
    const chatName = currentMessengerUser?.name || messengeruser?.name;
    if (chatName) {
      removeChat(chatName)
      toast.error(`Chat with ${chatName} cleared.`)
    }
    if (currentUserId && currentMessengerName) {
      deleteThread({ userId: currentUserId, userSendingMessage: currentMessengerName })
    }
    clearConversation()
    setCurrentMessengerUser(null)
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    // Get the selected chat user from the sidebar chats
    const selectedChat = sideBarChats[idx as number];
    if (selectedChat) {
      // Set the current messenger user for this conversation
      setCurrentMessengerUser(selectedChat);
    }
    toggle()
  }

  // triggerMessage is now defined above with useCallback

  const onMessageSend = () => {
    console.log("onMessageSend called", { 
      displayAllMessages, 
      threadId: displayAllMessages?.threadId, 
      userMessage,
      currentUserId,
      currentMessengerName 
    })
    
    if (!userMessage.trim()) {
      console.log("empty message")
      return
    }
    
    if (!currentUserId || !currentMessengerName) {
      console.log("missing user or messenger info")
      return
    }
    
    // If no thread exists, create one first
    if (!displayAllMessages?.threadId) {
      console.log("creating thread before sending message")
      createMessageThread({ referenceId: currentUserId, userToSendMessage: currentMessengerName })
      // Add message to context for immediate feedback
      addMessage(userMessage)
      setUserMessage("")
      return
    }
    
    // Emit to the messenger's room, not the current user's room
    socket.emit('private message', currentMessengerName, userMessage)
    addMessage(userMessage)
    setUserMessage("")
  }

  const setMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value)
  }

  // Move session check after all hooks are called to prevent hook order issues

  useEffect(() => {
    socket.connect()

    const handlePrivateMessage = (msg: string) => {
      console.log("Socket received message:", { msg, currentUserId, currentMessengerName })
      if (currentUserId && currentMessengerName) {
        console.log("Sending private message to API:", { chat: msg, userSendingMessageId: currentUserId, userSendingMessage: currentMessengerName })
        sendPrivateMessage({ chat: msg, userSendingMessageId: currentUserId, userSendingMessage: currentMessengerName });
      } else {
        console.log("Missing required parameters for sending message")
      }
    }

    socket.on('private message', handlePrivateMessage)

    return () => {
      socket.disconnect()
      socket.off("private message", handlePrivateMessage)
    }
  }, [currentUserId, currentMessengerName, sendPrivateMessage])





  const DisplayAllMessages = () => {
    // Only show loading when a fetch is actually in progress with valid params
    if (loadingMessages && currentUserId && currentMessengerName && currentMessengerName.trim() !== '') return <LoadingPage />

    if (sideBarChats.length === 0) {
      return (
        <div className="text-white bg-gray-900 w-full py-3 h-min border-2 border-gray-300 text-center">
          <p className="text-lg">No active chats</p>
          <p className="text-sm text-gray-400">Go to Friends to start messaging</p>
        </div>
      )
    }

    return (
      <>
      {sideBarChats?.map((chats: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; online: any; }, idx: React.Key) => {
        return (
          <div key={idx} className="text-white bg-gray-900 w-full py-3 h-min border-2 border-gray-300 cursor-pointer" onClick={() => onMessage(idx)}>
            <div className="flex flex-row justify-around items-center">
              <p className="text-xl">{chats?.name}</p>
              <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={chats?.online ? 'limegreen' : 'gray'} size="sm" />
            </div>
          </div>
        )
      })}
      </>
    )
  }

  // Early return after all hooks are called
  if (!session) return null

  return (
    <div className="flex flex-col flex-grow mt-32 overflow-scroll no-scrollbar overflow-y-auto">
      <Toaster />
      <MessageModal isShowing={isShowing} hide={toggle} storewords={setMessage} loadingmessages={loadingMessageSend} sendmessage={onMessageSend} message={userMessage} messages={displayAllMessages} user={String(currentMessengerUser?.name || messengeruser?.name)} onclosechat={closeChat} loading={Boolean(loadingMessages && currentUserId && currentMessengerName && currentMessengerName.trim() !== '')} />
      <DisplayAllMessages />
    </div>
  )
}
