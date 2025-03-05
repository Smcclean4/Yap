import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { UserInfoInterface } from '~/pages/friends';
import { MessageModal } from '~/modals/message';
import { useSession } from 'next-auth/react'
import { useModal } from '~/hooks/useModal';
import { Toaster, toast } from 'react-hot-toast';
import { socket } from '~/pages/api/socket-client';
import { api } from '~/utils/api';

interface MessengerInterface {
  messengeruser?: UserInfoInterface;
  trigger?: boolean;
}

export const ChatMessenger = ({ messengeruser, trigger }: MessengerInterface) => {
  const [sideBarChats, setSideBarChats]: Array<any> = useState([])
  const [userMessage, setUserMessage] = useState('')
  const [friendId, setFriendId] = useState('')
  const [conversationChat, setConversationChat] = useState<any>([])
  const [messengerUser, setMessengerUser]: any = useState('')

  const { isShowing, toggle } = useModal();
  const initialRender = useRef(true);

  const { data: session } = useSession();
  const ctx = api.useContext();

  const { mutate: createMessageThread, isLoading: loadingThreadCreation } = api.messenger.createThread.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const { data: displayAllMessages, isLoading: loadingMessages } = api.messenger.getChatMessages.useQuery({ referenceId: friendId })

  const { mutate: sendPrivateMessage, isLoading: loadingMessageSend } = api.messenger.postMessage.useMutation({
    onSettled: () => {
      void ctx.messenger.getChatMessages.invalidate();
    }
  })

  const itemExists = (name: string | undefined, item: { name: any; }[]) => {
    return item.some((chat: { name: any; }) => {
      return chat?.name === name
    })
  }

  const updateMessenger = () => {
    if (itemExists(messengeruser?.name, sideBarChats)) {
      return
    }
    setSideBarChats([...sideBarChats, messengeruser])
  }

  const closeChat = () => {
    setSideBarChats((state: any[]) => state.filter((chat: { name: string, message: string, online: boolean }, i: React.Key) => {
      if (sideBarChats[i].name === messengerUser) {
        return false
      } else {
        return chat
      }
    }))
    toast.error(`Chat with ${messengerUser} cleared.`)
    setConversationChat([])
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    toggle()
  }

  const triggerMessage = () => {
    setMessengerUser(messengeruser?.name)
    createMessageThread({ referenceId: friendId, threadId: friendId, chatMessage: userMessage, userToSendMessage: messengerUser })
    setFriendId(`${socket.id}`)
    toggle()
  }

  const onMessageSend = () => {
    socket.emit('private message', friendId, userMessage)
    setConversationChat([...conversationChat, userMessage])
    console.log(displayAllMessages)
    console.log(friendId)
    setUserMessage("")
  }

  const setMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value)
  }

  const createFunction = () => {
    // create function that incorporates user edits and controls
  }

  useEffect(() => {
    socket.connect()

    socket.on('private message', (friendSocketId, msg) => {
      setFriendId(friendSocketId)
      sendPrivateMessage({ referenceId: friendId, chat: msg, userSendingMessage: String(session?.user.email) })
    })

    return (() => {
      socket.disconnect()
      socket.off("private message")
    })
  }, [])

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      triggerMessage()
    }
    updateMessenger()
  }, [trigger])

  useEffect(() => {
    const sideBarChatStorage = JSON.parse(localStorage.getItem('sideBarChatData') || '[]')
    const conversationChatStorage = JSON.parse(localStorage.getItem('conversationChatData') || '[]')
    if (sideBarChatStorage || conversationChatStorage) {
      setSideBarChats(sideBarChatStorage)
      setConversationChat(conversationChatStorage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sideBarChatData', JSON.stringify(sideBarChats))
    localStorage.setItem('conversationChatData', JSON.stringify(conversationChat))
  }, [sideBarChats, conversationChat])

  return (
    <div className="flex flex-col flex-grow mt-32 overflow-scroll no-scrollbar overflow-y-auto">
      <Toaster />
      <MessageModal isShowing={isShowing} hide={toggle} storewords={setMessage} sendmessage={onMessageSend} message={userMessage} messages={conversationChat} user={messengerUser} onclosechat={closeChat} />
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
    </div>
  )
}
