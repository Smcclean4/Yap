import React, { useEffect, useState } from 'react'
import { MessageInfoInterface } from '~/pages/friends';

interface MessengerInterface {
  messengeruser?: MessageInfoInterface;
}

export const ChatMessenger = ({ messengeruser }: MessengerInterface) => {
  // when chat is open.. make new chat messenger in sidebar nav.
  // when messenger open button is clicked open modal with corresponding chat.

  const [chats, setChats]: Array<any> = useState([])

  const itemExists = (username: string | undefined) => {
    return chats.some((chat: { username: any; }) => {
      return chat.username === username
    })
  }

  useEffect(() => {
    if (itemExists(messengeruser?.username)) {
      return
    } else {
      setChats([...chats, messengeruser])
    }
  }, [messengeruser])

  return (
    <div className="flex flex-col flex-grow mt-24">
      {chats?.map((chats: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key) => {
        return (
          <div key={idx} className="text-white bg-gray-900 w-full py-3 h-min border-b-2 border-gray-300">
            <p>{chats.username}</p>
            <div className="font-extralight italic">
              <p>{chats.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
