import React, { useEffect, useState } from 'react'
import { MessageInfoInterface } from '~/pages/friends';

interface MessengerInterface {
  messengeruser?: MessageInfoInterface;
}

export const ChatMessenger = ({ messengeruser }: MessengerInterface) => {
  // when chat is open.. make new chat messenger in sidebar nav.
  // when messenger open button is clicked open modal with corresponding chat.

  interface MessengerChatInterface {
    username?: string;
    message?: string;
  }

  const [chats, setChats]: Array<any> = useState([])
  const [messengerChats, setMessengerChats] = useState<MessengerChatInterface>({
    username: '',
    message: ''
  });

  useEffect(() => {
    setMessengerChats({ username: messengeruser?.username, message: messengeruser?.message })
    setChats([...chats, messengerChats])
    console.log(messengerChats)
    console.log(chats)
  }, [messengeruser])

  return (
    <div className="flex flex-grow mt-28">
      {chats?.map((chats: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
        <div className="text-white bg-gray-900 w-full h-min mt-2 border-b-2 border-gray-300">
          <p>{chats.username}</p>
          <p>{chats.message}</p>
        </div>
      })}
    </div>
  )
}
