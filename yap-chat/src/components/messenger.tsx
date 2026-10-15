import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { UserInfoInterface } from '~/pages/friends';
import { MessageModal } from '~/modals/message';
import { useSession } from 'next-auth/react'
import { useModal } from '~/hooks/useModal';
import { Toaster, toast } from 'react-hot-toast';
import { api } from '~/utils/api';
import { socket } from '~/pages/api/socket-client';
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
    addChat,
    removeChat,
    addMessage,
    clearConversation,
    isUserOnline,
    resetUnread,
    getUnreadCount,
    setActiveChat,
    clearActiveChat,
  } = useChatContext();

  const { data: session } = useSession();
  const ctx = api.useContext();

  const currentUserId = session?.user.id;
  const currentMessengerName = currentMessengerUser?.name || messengeruser?.name;
  const currentMessengerFriendId = currentMessengerUser?.friendId || messengeruser?.friendId || undefined;

  const friendKey = {
    friendName: currentMessengerName || undefined,
    friendId: currentMessengerFriendId,
  }

  const { data: displayAllMessages, isLoading: loadingMessages } = api.messenger.getChatMessages.useQuery(
    friendKey,
    {
      enabled: Boolean(currentUserId && (currentMessengerFriendId || (currentMessengerName && currentMessengerName.trim() !== ''))),
      retry: 3,
      retryDelay: 1000
    }
  )

  const itemExists = useCallback((name: string | undefined, item: UserInfoInterface[]) => {
    return item.some((chat) => chat.name === name);
  }, [])

  const { mutate: createMessageThread } = api.messenger.createThread.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const { mutate: sendPrivateMessage, isLoading: loadingMessageSend } = api.messenger.postMessage.useMutation({
    onSuccess: (_data, variables) => {
      if (currentMessengerUser?.friendId && currentUserId) {
        socket.emit("dm:new", {
          toUserId: currentMessengerUser.friendId,
          senderId: currentUserId,
          senderName: session?.user.name || '',
          senderImage: session?.user.image || '',
          senderHeading: '',
          message: variables.chat,
        }, "sidebar:update");

        if (!itemExists(currentMessengerUser.name, sideBarChats)) {
          addChat(currentMessengerUser);
        }
      }
    },
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const { mutate: deleteThread } = api.messenger.deleteThread.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const updateMessenger = useCallback(() => {
    // Only add to chats if we have a messengeruser AND the trigger is true (meaning message was clicked)
    if (messengeruser && trigger && !itemExists(messengeruser.name, sideBarChats)) {
      addChat(messengeruser)
    }
  }, [messengeruser, trigger, itemExists, sideBarChats, addChat])

  // Only update messenger if we have a messengeruser
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (messengeruser) {
      updateMessenger()
    }

    if (trigger && messengeruser && currentUserId && messengeruser.name) {
      setCurrentMessengerUser(messengeruser)
      createMessageThread({ friendName: messengeruser.name, friendId: messengeruser.friendId ?? undefined })
      // Reset unread count and set as active chat when opening a chat
      if (messengeruser.friendId || messengeruser.name) {
        resetUnread(String(messengeruser.friendId ?? ''), messengeruser.name)
        setActiveChat(String(messengeruser.friendId ?? ''), messengeruser.name)
      }
    }
  }, [trigger, messengeruser, updateMessenger, currentUserId, createMessageThread, resetUnread, setActiveChat])

  // Handle toggle separately to avoid infinite loops
  useEffect(() => {
    if (trigger && messengeruser) {
      toggle()
    }
  }, [trigger, messengeruser, toggle])

  // Clear active chat when modal is closed
  useEffect(() => {
    if (!isShowing) {
      clearActiveChat()
    }
  }, [isShowing, clearActiveChat])

  const closeChat = () => {
    const chatName = currentMessengerUser?.name || messengeruser?.name;
    if (chatName) {
      removeChat(chatName)
      toast.success(`Chat with ${chatName} cleared. (Your view only)`)
    }
    if (currentUserId && currentMessengerName) {
      deleteThread({ friendName: currentMessengerName, friendId: currentMessengerFriendId })
    }
    clearConversation()
    setCurrentMessengerUser(null)
    clearActiveChat() // Clear active chat when closing
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    // Get the selected chat user from the sidebar chats
    const selectedChat = sideBarChats[idx as number];
    if (selectedChat) {
      // Set the current messenger user for this conversation
      setCurrentMessengerUser(selectedChat);
      // Reset unread count and set as active chat when opening a chat
      if (selectedChat.friendId || selectedChat.name) {
        resetUnread(String(selectedChat.friendId ?? ''), selectedChat.name)
        setActiveChat(String(selectedChat.friendId ?? ''), selectedChat.name)
      }
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

    if (!currentUserId || (!currentMessengerName && !currentMessengerFriendId)) {
      console.log("missing user or messenger info")
      return
    }
    const text = userMessage.trim()
    sendPrivateMessage({ chat: text, friendName: currentMessengerName, friendId: currentMessengerFriendId })
    addMessage(text)
    setUserMessage("")
  }

  const setMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value)
  }

  // Move session check after all hooks are called to prevent hook order issues
  // Socket connection + presence is handled globally in ChatProvider.

  const DisplayAllMessages = () => {
    // Only show loading when a fetch is actually in progress with valid params
    if (loadingMessages && currentUserId && currentMessengerName && currentMessengerName.trim() !== '') return <LoadingPage />

    if (sideBarChats.length === 0) {
      return (
        <div className="m-3 h-min rounded-xl border border-white/10 bg-gray-900/80 py-5 text-center text-white">
          <p className="text-lg font-semibold">No active chats</p>
          <p className="text-sm text-gray-400">Go to Friends to start messaging</p>
        </div>
      )
    }

    return (
      <>
        {sideBarChats?.map((chats: UserInfoInterface, idx: number) => {
          const liveOnline = isUserOnline(chats.friendId);
          const unreadCount = getUnreadCount(String(chats.friendId ?? ''), chats.name);
          return (
            <div key={chats.id ?? idx} className="m-2 h-min cursor-pointer rounded-xl border border-white/10 bg-gray-900/80 px-3 py-3 text-white transition hover:border-blue-400 hover:bg-gray-800" onClick={() => onMessage(idx)}>
              <div className="flex flex-row items-center justify-between gap-3">
                <p className="truncate text-lg font-semibold">{chats?.name}</p>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon className="rounded-full border-2 border-gray-100" icon={faCircle} color={liveOnline ? 'limegreen' : 'gray'} size="sm" />
                  {unreadCount > 0 && <p className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</p>}
                </div>
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
    <div className="no-scrollbar flex flex-grow flex-col overflow-y-auto overflow-scroll">
      <Toaster />
      <MessageModal isShowing={isShowing} hide={toggle} storewords={setMessage} loadingmessages={loadingMessageSend} sendmessage={onMessageSend} message={userMessage} messages={displayAllMessages}
        sessionUser={String(currentUserId ?? '')}
        user={String(currentMessengerUser?.name || messengeruser?.name)} onclosechat={closeChat} loading={Boolean(loadingMessages && currentUserId && currentMessengerName && currentMessengerName.trim() !== '')} />
      <DisplayAllMessages />
    </div>
  )
}
