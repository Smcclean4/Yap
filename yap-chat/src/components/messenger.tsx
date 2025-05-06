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
import { LoadingPage } from '~/shared/loading';

interface MessengerInterface {
  messengeruser?: UserInfoInterface;
  trigger?: boolean;
}

export const ChatMessenger = ({ messengeruser, trigger }: MessengerInterface) => {
  const [sideBarChats, setSideBarChats]: Array<any> = useState([])
  const [userMessage, setUserMessage] = useState('')
  const [conversationChat, setConversationChat] = useState<any>([])
  const [messengerUser, setMessengerUser]: any = useState('')

  const { isShowing, toggle } = useModal();
  const initialRender = useRef(true);

  const { data: session } = useSession();
  const ctx = api.useContext();

  const { data: displayAllMessages, isLoading: loadingMessages } = api.messenger.getChatMessages.useQuery({ sender: messengerUser })

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

  const itemExists = (name: string | undefined, item: { name: any; }[]) => {
    return item.some((chat: { name: any; }) => {
      return chat?.name === name
    })
  }

  const updateMessenger = () => {
    if (itemExists(messengeruser?.name, sideBarChats)) {
      return
    }
    setMessengerUser(messengeruser?.name)
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
    deleteThread({ userSendingMessage: messengerUser })
    setConversationChat([])
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    toggle()
  }

  const triggerMessage = () => {
    setMessengerUser(messengeruser?.name)
    createMessageThread({ referenceId: String(session?.user.id), userToSendMessage: messengerUser })
    toggle()
  }

  const onMessageSend = () => {
    socket.emit('private message', displayAllMessages?.threadId, userMessage)
    console.log(displayAllMessages)
    setConversationChat([...conversationChat, userMessage])
    setUserMessage("")
  }

  const setMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value)
  }

  useEffect(() => {
    socket.connect()

    socket.on('private message', (msg) => {
      sendPrivateMessage({ chat: msg, userSendingMessage: messengerUser });
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
      {/* figure out a way to pop out display messages so that loading page can display */}
      <MessageModal isShowing={isShowing} hide={toggle} storewords={setMessage} sendmessage={onMessageSend} message={userMessage} messages={displayAllMessages?.chat} user={messengerUser} onclosechat={closeChat} />
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
