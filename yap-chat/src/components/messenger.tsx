import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { MessageInfoInterface } from '~/pages/friends';
import { MessageModal } from '~/modals/message';
import { useModal } from '~/hooks/useModal';

interface MessengerInterface {
  messengeruser?: MessageInfoInterface;
  trigger?: boolean;
}

export const ChatMessenger = ({ messengeruser, trigger }: MessengerInterface) => {
  // when chat is open.. make new chat messenger in sidebar nav.
  // when messenger open button is clicked open modal with corresponding chats
  const [chats, setChats]: Array<any> = useState([])
  const [messengerUser, setMessengerUser]: any = useState('')

  const { isShowing, toggle } = useModal();
  const initialRender = useRef(true);

  const onMessageSend = () => {
    alert('attempting to send message!')
  }

  const itemExists = (username: string | undefined, item: { username: any; }[]) => {
    return item.some((chat: { username: any; }) => {
      return chat?.username === username
    })
  }

  const updateMessenger = () => {
    if (itemExists(messengeruser?.username, chats)) {
      return
    } else {
      setChats([...chats, messengeruser])
    }
  }

  const closeChat = () => {
    setChats((state: any[]) => state.filter((chat: { username: string, message: string, online: boolean }, i: React.Key) => {
      if (chats[i].username === messengerUser) {
        return false
      } else {
        return chat
      }
    }))
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    setMessengerUser(chats[idx].username)
    // esablish connection here
    toggle()
  }

  const triggerMessage = () => {
    setMessengerUser(messengeruser?.username)
    // establish connection here
    toggle()
  }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      triggerMessage()
    }
  }, [trigger])

  useEffect(() => {
    updateMessenger()
  }, [messengeruser])

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
      <MessageModal isShowing={isShowing} hide={toggle} sendmessage={onMessageSend} messages={'user messages here'} user={messengerUser} onclosechat={closeChat} />
      {chats?.map((chats: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; online: any; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key) => {
        return (
          <div key={idx} className="text-white bg-gray-900 w-full py-3 h-min border-2 border-gray-300 cursor-pointer" onClick={() => onMessage(idx)}>
            <div className="flex flex-row justify-around items-center">
              <p className="text-xl">{chats?.username}</p>
              <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={chats?.online ? 'limegreen' : 'gray'} size="sm" />
            </div>
            <div className="font-extralight italic">
              <p>{chats?.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
