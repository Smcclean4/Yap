import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { UserInfoInterface } from '~/pages/friends';
import { MessageModal } from '~/modals/message';
import { useModal } from '~/hooks/useModal';
import { Toaster, toast } from 'react-hot-toast';

interface MessengerInterface {
  messengeruser?: UserInfoInterface;
  trigger?: boolean;
}

export const ChatMessenger = ({ messengeruser, trigger }: MessengerInterface) => {
  const [chats, setChats]: Array<any> = useState([])
  const [messengerUser, setMessengerUser]: any = useState('')

  const { isShowing, toggle } = useModal();
  const initialRender = useRef(true);

  const onMessageSend = () => {
    alert('attempting to send message!')
  }

  const itemExists = (name: string | undefined, item: { name: any; }[]) => {
    return item.some((chat: { name: any; }) => {
      return chat?.name === name
    })
  }

  const updateMessenger = () => {
    if (itemExists(messengeruser?.name, chats)) {
      return
    }
    setChats([...chats, messengeruser])
  }

  const closeChat = () => {
    setChats((state: any[]) => state.filter((chat: { name: string, message: string, online: boolean }, i: React.Key) => {
      if (chats[i].name === messengerUser) {
        return false
      } else {
        return chat
      }
    }))
    toast.error(`Chat with ${messengerUser} cleared.`)
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    setMessengerUser(chats[idx].name)
    // esablish connection here
    toggle()
  }

  const triggerMessage = () => {
    setMessengerUser(messengeruser?.name)
    // establish connection here
    toggle()
  }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      triggerMessage()
    }
    updateMessenger()
  }, [trigger])

  useEffect(() => {
    const chatsStorage = JSON.parse(localStorage.getItem('chatsData') || '[]')
    if (chatsStorage) {
      setChats(chatsStorage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatsData', JSON.stringify(chats))
  }, [chats])

  return (
    <div className="flex flex-col flex-grow mt-32 overflow-scroll no-scrollbar overflow-y-auto">
      <Toaster />
      <MessageModal isShowing={isShowing} hide={toggle} sendmessage={onMessageSend} messages={'user messages here'} user={messengerUser} onclosechat={closeChat} />
      {chats?.map((chats: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; online: any; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key) => {
        return (
          <div key={idx} className="text-white bg-gray-900 w-full py-3 h-min border-2 border-gray-300 cursor-pointer" onClick={() => onMessage(idx)}>
            <div className="flex flex-row justify-around items-center">
              <p className="text-xl">{chats?.name}</p>
              <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={chats?.online ? 'limegreen' : 'gray'} size="sm" />
            </div>
            <div className="font-extralight italic">
              {/* have messages pull from a database of messages between the user and the current clicked user */}
              <p>{chats?.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
